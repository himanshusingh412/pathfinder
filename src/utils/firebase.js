import { initializeApp, getApps } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  serverTimestamp
} from "firebase/firestore";

// Detect if real Firebase config is provided and is not a placeholder
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasRealConfig = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "your_firebase_api_key_here" && 
  firebaseConfig.projectId && 
  firebaseConfig.projectId !== "your_project_id_here";

export const isMockMode = !hasRealConfig;

let app = null;
let auth = null;
let db = null;

if (!isMockMode) {
  try {
    console.log("Initializing Firebase with real credentials...");
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase failed to initialize. Switched to offline mock mode.", error);
    app = null;
    auth = null;
    db = null;
  }
}

if (isMockMode || !auth || !db) {
  console.warn("PathfinderAI: Firebase running in OFFLINE MOCK MODE. Data is persisted in localStorage.");
}

// ==========================================
// 1. AUTHENTICATION SERVICE IMPLEMENTATION
// ==========================================
export const authService = {
  onAuthChange: (callback) => {
    if (!isMockMode && auth) {
      return onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // Fetch extra details from Firestore if available
          let name = firebaseUser.displayName || "";
          try {
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            if (userDoc.exists()) {
              name = userDoc.data().name || name;
            }
          } catch (e) {
            console.error("Error fetching user profile from Firestore:", e);
          }
          callback({
            uid: firebaseUser.uid,
            name: name || firebaseUser.email?.split("@")[0] || "User",
            email: firebaseUser.email,
            createdAt: firebaseUser.metadata.creationTime,
            isMock: false
          });
        } else {
          callback(null);
        }
      });
    } else {
      // Mock Subscription logic using localStorage
      const checkMockUser = () => {
        const activeUser = localStorage.getItem("pf_active_user");
        if (activeUser) {
          callback(JSON.parse(activeUser));
        } else {
          callback(null);
        }
      };

      // Poll or trigger checks on auth actions
      window.addEventListener("auth-state-changed", checkMockUser);
      // Run once initially
      checkMockUser();

      // Return unsubscribe handler
      return () => {
        window.removeEventListener("auth-state-changed", checkMockUser);
      };
    }
  },

  signup: async (email, password, name) => {
    if (!isMockMode && auth) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update Auth Profile DisplayName
      await updateProfile(firebaseUser, { displayName: name });
      
      // Save Profile in Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), {
        userId: firebaseUser.uid,
        name,
        email,
        createdAt: new Date().toISOString()
      });

      return {
        uid: firebaseUser.uid,
        name,
        email,
        createdAt: new Date().toISOString(),
        isMock: false
      };
    } else {
      // Mock Signup Implementation
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
      
      const mockUsers = JSON.parse(localStorage.getItem("pf_mock_users") || "[]");
      if (mockUsers.some(u => u.email === email)) {
        throw new Error("auth/email-already-in-use: The email address is already in use by another account.");
      }

      const uid = "mock_user_" + Math.random().toString(36).substr(2, 9);
      const newUser = {
        uid,
        name,
        email,
        createdAt: new Date().toISOString(),
        isMock: true
      };

      // Add to users database and set as active session
      mockUsers.push({ ...newUser, password }); // Store password just for mock verification
      localStorage.setItem("pf_mock_users", JSON.stringify(mockUsers));
      localStorage.setItem("pf_active_user", JSON.stringify(newUser));
      
      // Dispatch auth change event
      window.dispatchEvent(new Event("auth-state-changed"));
      
      return newUser;
    }
  },

  login: async (email, password) => {
    if (!isMockMode && auth) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Load name from profile
      let name = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User";
      try {
        const docSnap = await getDoc(doc(db, "users", firebaseUser.uid));
        if (docSnap.exists()) {
          name = docSnap.data().name || name;
        }
      } catch (err) {
        console.error(err);
      }

      return {
        uid: firebaseUser.uid,
        name,
        email: firebaseUser.email,
        createdAt: firebaseUser.metadata.creationTime,
        isMock: false
      };
    } else {
      // Mock Login Implementation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockUsers = JSON.parse(localStorage.getItem("pf_mock_users") || "[]");
      const matchedUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!matchedUser) {
        throw new Error("auth/invalid-credential: The email or password provided is incorrect.");
      }

      const userSession = {
        uid: matchedUser.uid,
        name: matchedUser.name,
        email: matchedUser.email,
        createdAt: matchedUser.createdAt,
        isMock: true
      };

      localStorage.setItem("pf_active_user", JSON.stringify(userSession));
      window.dispatchEvent(new Event("auth-state-changed"));
      
      return userSession;
    }
  },

  loginWithGoogle: async () => {
    if (!isMockMode && auth) {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;
      
      // Check if user already has a document in Firestore
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      const name = firebaseUser.displayName || "Google User";
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          userId: firebaseUser.uid,
          name,
          email: firebaseUser.email,
          createdAt: new Date().toISOString()
        });
      }

      return {
        uid: firebaseUser.uid,
        name,
        email: firebaseUser.email,
        createdAt: firebaseUser.metadata.creationTime,
        isMock: false
      };
    } else {
      // Mock Google Login
      await new Promise(resolve => setTimeout(resolve, 600));
      const mockUsers = JSON.parse(localStorage.getItem("pf_mock_users") || "[]");
      
      const email = "google.student@gmail.com";
      let matchedUser = mockUsers.find(u => u.email === email);
      
      if (!matchedUser) {
        const uid = "mock_google_user";
        matchedUser = {
          uid,
          name: "Aarav Google",
          email,
          createdAt: new Date().toISOString(),
          isMock: true
        };
        mockUsers.push(matchedUser);
        localStorage.setItem("pf_mock_users", JSON.stringify(mockUsers));
      }

      const userSession = {
        uid: matchedUser.uid,
        name: matchedUser.name,
        email: matchedUser.email,
        createdAt: matchedUser.createdAt,
        isMock: true
      };

      localStorage.setItem("pf_active_user", JSON.stringify(userSession));
      window.dispatchEvent(new Event("auth-state-changed"));
      
      return userSession;
    }
  },

  logout: async () => {
    if (!isMockMode && auth) {
      await signOut(auth);
    } else {
      localStorage.removeItem("pf_active_user");
      window.dispatchEvent(new Event("auth-state-changed"));
    }
  }
};

// ==========================================
// 2. FIRESTORE DATABASE SERVICE IMPLEMENTATION
// ==========================================
export const dbService = {
  addHistoryItem: async (userId, action, details, status = "success", location = "") => {
    const historyData = {
      userId,
      action,
      details,
      status,
      location: location || "India",
      createdAt: new Date().toISOString()
    };

    if (!isMockMode && db) {
      try {
        const docRef = await addDoc(collection(db, "history"), {
          ...historyData,
          createdAt: serverTimestamp() // Use Firestore serverTimestamp for sorting accuracy
        });
        return { id: docRef.id, ...historyData };
      } catch (err) {
        console.error("Firestore addHistoryItem failed, logging locally:", err);
      }
    }

    // Mock/Fallback database storage
    const mockHistory = JSON.parse(localStorage.getItem("pf_mock_history") || "[]");
    const id = "history_" + Math.random().toString(36).substr(2, 9);
    const newEntry = { id, ...historyData };
    mockHistory.unshift(newEntry); // Insert at beginning so we get latest first
    localStorage.setItem("pf_mock_history", JSON.stringify(mockHistory));
    return newEntry;
  },

  getHistoryList: async (userId) => {
    if (!isMockMode && db) {
      try {
        // Query history for the current user, ordered by createdAt descending
        // NOTE: If using composite query with orderBy, a Firestore index might be needed.
        // We order by createdAt descending.
        const q = query(
          collection(db, "history"), 
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const history = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          history.push({
            id: doc.id,
            ...data,
            // Convert serverTimestamp to ISO string
            createdAt: data.createdAt?.seconds 
              ? new Date(data.createdAt.seconds * 1000).toISOString() 
              : data.createdAt || new Date().toISOString()
          });
        });
        return history;
      } catch (err) {
        console.error("Firestore getHistoryList failed, falling back to local history:", err);
      }
    }

    // Mock/Fallback database retrieval
    const mockHistory = JSON.parse(localStorage.getItem("pf_mock_history") || "[]");
    return mockHistory.filter(item => item.userId === userId);
  }
};

import { dbService, isMockMode } from './firebase';
import { getAuth } from 'firebase/auth';

/**
 * Automatically log user actions to history silently in the background.
 * @param {string} action - Action name (e.g. "roadmap_generated", "chat_question", "login", "logout")
 * @param {string} details - Detailed explanation of the action
 * @param {string} status - "success" | "failed" | "pending"
 * @param {string} location - Inferred student location or location text
 */
export function addHistory(action, details, status = "success", location = "") {
  let userId = null;

  // Resolve user ID based on mode
  if (!isMockMode) {
    try {
      const auth = getAuth();
      userId = auth.currentUser?.uid;
    } catch (e) {
      // Ignore auth module reading errors
    }
  }

  // Fallback to local active session
  if (!userId) {
    try {
      const session = JSON.parse(localStorage.getItem("pf_active_user") || "null");
      userId = session?.uid;
    } catch (e) {
      // Ignore local storage parsing errors
    }
  }

  if (!userId) {
    console.warn(`[History] Action "${action}" was not logged because no user is authenticated.`);
    return Promise.resolve(null);
  }

  // Run in background: log the action and catch any failures silently
  console.log(`[History Logged] Action: ${action} - User: ${userId}`);
  return dbService.addHistoryItem(userId, action, details, status, location)
    .catch((err) => {
      console.error(`[History Error] Failed to log action "${action}":`, err);
    });
}

/**
 * Fetch the history list for the currently logged-in user.
 * @returns {Promise<Array>} List of history entries, sorted by newest first.
 */
export async function fetchUserHistory() {
  let userId = null;

  if (!isMockMode) {
    try {
      const auth = getAuth();
      userId = auth.currentUser?.uid;
    } catch (e) {
      // Ignore
    }
  }

  if (!userId) {
    try {
      const session = JSON.parse(localStorage.getItem("pf_active_user") || "null");
      userId = session?.uid;
    } catch (e) {
      // Ignore
    }
  }

  if (!userId) {
    return [];
  }

  return dbService.getHistoryList(userId);
}

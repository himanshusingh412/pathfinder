const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// High-Fidelity Mock Database for Offline Unified Discovery Mode
const MOCK_DATABASE = {
  English: {
    interestDiscovery: [
      {
        interest: "Technology & Software Systems",
        whyItFits: "Your analytical profile and math background point towards structural logic and code construction.",
        subFields: ["Software Development", "Artificial Intelligence", "Cybersecurity"],
        tryThisWeek: [
          "Watch a 15-minute introduction video to Python programming",
          "Try a free web building exercise on freeCodeCamp",
          "Browse through repository readme files on GitHub to see how software works"
        ]
      },
      {
        interest: "Digital Product Creation",
        whyItFits: "Combines your subjects with design interests, focusing on user experience.",
        subFields: ["UX/UI Design", "Product Management", "Data Analytics"],
        tryThisWeek: [
          "Download Figma and play around with shape tools to design a basic login screen",
          "Read a case study about how a popular app like Zomato optimized its ordering flow",
          "Look up a basic video tutorial on Google Analytics or Data Visualization"
        ]
      }
    ],
    careerPaths: [
      { title: "Artificial Intelligence & ML Engineer", description: "Design and implement machine learning models, neural networks, and AI systems.", salaryRange: "₹8,0,000 - ₹35,0,000 / year", demandLevel: "High" },
      { title: "Full Stack Software Developer", description: "Build end-to-end web and mobile applications, handling both frontend UI and backend databases.", salaryRange: "₹5,0,000 - ₹20,00,000 / year", demandLevel: "High" },
      { title: "Cybersecurity Analyst", description: "Protect organizational networks, systems, and data from cyber threats and security breaches.", salaryRange: "₹6,0,000 - ₹18,00,000 / year", demandLevel: "Medium" }
    ],
    roadmap: [
      { step: 1, title: "Explore Tech Basics", description: "Take small coding exercises and watch intro tutorials to see if coding excites you.", duration: "1 Month" },
      { step: 2, title: "Commit to a Core Skill", description: "Select either frontend development or Python scripting and build 3 micro-projects.", duration: "3 Months" },
      { step: 3, title: "Prepare for Core Entrances", description: "Focus on JEE or equivalent entrance syllabus alongside early coding portfolio building.", duration: "Class 11/12" }
    ],
    exams: [
      { 
        name: "JEE Mains & JEE Advanced", 
        description: "National level entrance exam for engineering programs at IITs, NITs, and IIITs.", 
        eligibility: "Class 12 with Physics, Chemistry, and Mathematics (PCM)",
        officialLink: "https://jeemain.nta.ac.in/",
        youtubeSearch: "JEE Main prep strategy for physics chemistry maths"
      },
      { 
        name: "BITSAT", 
        description: "Entrance exam for Birla Institute of Technology and Science (BITS) campuses.", 
        eligibility: "Class 12 with PCM and minimum 75% aggregate",
        officialLink: "https://www.bitsadmission.com/",
        youtubeSearch: "BITSAT preparation strategy and mock test analysis"
      }
    ],
    colleges: [
      { name: "IIT Bombay", location: "Mumbai, Maharashtra", ranking: "NIRF #1", type: "Government" },
      { name: "BITS Pilani", location: "Pilani, Rajasthan", ranking: "Private #1", type: "Private" },
      { name: "Delhi Technological University (DTU)", location: "Delhi", ranking: "NIRF #12", type: "Government" }
    ],
    skills: [
      { name: "Python Programming", importance: "Must Have", resources: "https://roadmap.sh/pdfs/roadmaps/python.pdf" },
      { name: "Data Structures & Algorithms", importance: "Must Have", resources: "LeetCode, GeeksforGeeks, Coursera" },
      { name: "Full-Stack Development (React/Node)", importance: "Good to Have", resources: "freeCodeCamp, Full Stack Open" }
    ]
  },
  Hindi: {
    Technology: {
      interestDiscovery: [
        {
          interest: "प्रौद्योगिकी और सॉफ्टवेयर (Technology)",
          whyItFits: "आपके अच्छे अंक और गणित/तर्क में रुचि सॉफ्टवेयर निर्माण की दिशा में संकेत करते हैं।",
          subFields: ["सॉफ्टवेयर डेवलपमेंट", "आर्टिफिशियल इंटेलिजेंस (AI)", "साइबर सुरक्षा"],
          tryThisWeek: [
            "पायथन प्रोग्रामिंग का 15 मिनट का परिचय वीडियो देखें।",
            "freeCodeCamp पर एक साधारण वेब पेज बनाने का प्रयास करें।",
            "GitHub पर जाकर देखें कि सॉफ्टवेयर प्रोजेक्ट्स कैसे लिखे और साझा किए जाते हैं।"
          ]
        }
      ],
      careerPaths: [
        { title: "आर्टिफिशियल इंटेलिजेंस और मशीन लर्निंग इंजीनियर", description: "मशीन लर्निंग मॉडल, न्यूरल नेटवर्क और एआई सिस्टम का डिज़ाइन और कार्यान्वयन करना।", salaryRange: "₹8,0,000 - ₹35,0,000 / वर्ष", demandLevel: "High" },
        { title: "फुल स्टैक सॉफ्टवेयर डेवलपर", description: "फ्रंटएंड और बैकएंड डेटाबेस दोनों को संभालते हुए, संपूर्ण वेब और मोबाइल एप्लिकेशन बनाना।", salaryRange: "₹5,00,000 - ₹20,00,000 / वर्ष", demandLevel: "High" }
      ],
      roadmap: [
        { step: 1, title: "बुनियादी तकनीकी ज्ञान", description: "कोडिंग ट्यूटोरियल देखें और पता करें कि क्या आपको प्रोग्रामिंग पसंद आती है।", duration: "1 महीना" },
        { step: 2, title: "बोर्ड और प्रवेश परीक्षा की तैयारी", description: "इंजीनियरिंग प्रवेश परीक्षाओं की तैयारी करें और कोडिंग का अभ्यास जारी रखें।", duration: "कक्षा 11/12" }
      ],
      exams: [
        { 
          name: "JEE Mains & JEE Advanced", 
          description: "आईआईटी और एनआईटी में प्रवेश के लिए प्रवेश परीक्षा।", 
          eligibility: "भौतिकी, रसायन विज्ञान और गणित (PCM) के साथ कक्षा 12 उत्तीर्ण",
          officialLink: "https://jeemain.nta.ac.in/",
          youtubeSearch: "JEE Main preparation physics chemistry maths"
        }
      ],
      colleges: [
        { name: "IIT Bombay", location: "मुंबई, महाराष्ट्र", ranking: "NIRF #1", type: "Government" }
      ],
      skills: [
        { name: "पायथन प्रोग्रामिंग (Python Programming)", importance: "Must Have", resources: "https://roadmap.sh/pdfs/roadmaps/python.pdf" },
        { name: "डेटा संरचनाएं और एल्गोरिदम", importance: "Must Have", resources: "LeetCode, GeeksforGeeks" }
      ]
    },
    Default: {
      interestDiscovery: [
        {
          interest: "व्यावसायिक रणनीति और प्रबंधन",
          whyItFits: "आपका प्रोफाइल रणनीतिक योजना, नेतृत्व और बाजार संचालन के अनुकूल है।",
          subFields: ["कंसल्टिंग", "मार्केटिंग", "उद्यमिता (Entrepreneurship)"],
          tryThisWeek: [
            "मैनेजमेंट कंसल्टेंट्स कैसे समस्याओं को हल करते हैं, इस पर एक वीडियो देखें।",
            "एक लोकप्रिय स्टार्टअप केस स्टडी पढ़ें।"
          ]
        }
      ],
      careerPaths: [
        { title: "व्यावसायिक सलाहकार (Business Consultant)", description: "संगठनों को उनके व्यावसायिक लक्ष्यों, वित्त और रणनीति के बारे में सलाह देना।", salaryRange: "₹7,0,000 - ₹22,0,000 / वर्ष", demandLevel: "High" }
      ],
      roadmap: [
        { step: 1, title: "स्नातक शिक्षा (Undergraduate Foundations)", description: "BBA, B.Com, या B.A. की डिग्री के लिए आवेदन करें।", duration: "3 वर्ष" }
      ],
      exams: [
        { 
          name: "CAT (Common Admission Test)", 
          description: "आईआईएम (IIMs) में प्रवेश के लिए सामान्य प्रवेश परीक्षा।", 
          eligibility: "न्यूनतम 50% अंकों के साथ स्नातक की डिग्री",
          officialLink: "https://iimcat.ac.in/",
          youtubeSearch: "CAT examination study strategies"
        }
      ],
      colleges: [
        { name: "IIM Ahmedabad", location: "अहमदाबाद, गुजरात", ranking: "NIRF #1", type: "Government" }
      ],
      skills: [
        { name: "समस्या समाधान विश्लेषण (Analytical Problem Solving)", importance: "Must Have", resources: "केस स्टडी बुक्स, कोर्सेरा" }
      ]
    }
  }
};

function getOfflineMockRoadmap(studentData) {
  const lang = studentData.language === 'Hindi' ? 'Hindi' : 'English';
  
  if (lang === 'English') {
    return MOCK_DATABASE.English;
  }
  
  const interests = studentData.interests || [];
  const hasTech = interests.some(i => i.toLowerCase().includes('tech') || i.toLowerCase().includes('science'));
  const hasMed = interests.some(i => i.toLowerCase().includes('med') || i.toLowerCase().includes('health'));
  
  let category = 'Default';
  if (hasTech) {
    category = 'Technology';
  } else if (hasMed) {
    category = 'Medicine';
  }
  
  return MOCK_DATABASE[lang][category] || MOCK_DATABASE[lang]['Default'];
}

export async function generateCareerRoadmap(studentData) {
  try {
    const response = await fetch('/api/roadmap', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ studentData })
    });

    if (response.ok) {
      return await response.json();
    }

    if (response.status === 404) {
      console.warn("Backend API route '/api/roadmap' returned 404. Falling back to offline mock mode.");
      return getOfflineMockRoadmap(studentData);
    }

    const errText = await response.text();
    throw new Error(errText || `Server responded with status ${response.status}`);
  } catch (error) {
    if (error instanceof TypeError || error.message.includes('fetch')) {
      console.warn("Could not connect to backend API '/api/roadmap'. Falling back to offline mock mode.", error);
      return getOfflineMockRoadmap(studentData);
    }
    throw error;
  }
}

export async function sendChatMessage(messages, studentContext) {
  try {
    const response = await fetch('/api/chat', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages, studentContext })
    });

    if (response.ok) {
      const data = await response.json();
      return data.reply;
    }

    if (response.status === 404) {
      console.warn("Backend API route '/api/chat' returned 404. Falling back to offline mock mode.");
      return getOfflineMockChat(messages, studentContext);
    }

    const errText = await response.text();
    throw new Error(errText || `Server responded with status ${response.status}`);
  } catch (error) {
    if (error instanceof TypeError || error.message.includes('fetch')) {
      console.warn("Could not connect to backend API '/api/chat'. Falling back to offline mock mode.", error);
      return getOfflineMockChat(messages, studentContext);
    }
    throw error;
  }
}

function getOfflineMockChat(messages, studentContext) {
  const context = JSON.parse(studentContext);
  const lang = context.studentData?.language || "English";
  const lastUserQuery = messages[messages.length - 1]?.content || "";
  const lowerQuery = lastUserQuery.toLowerCase();

  let reply = "";
  if (lowerQuery.includes("game") || lowerQuery.includes("gaming") || lowerQuery.includes("खेल")) {
    reply = `🎯 Understanding Gaming Careers

• What you’ll do:
→ Game Design (rules, story)
→ Game Development (coding, physics)
→ Game Art (3D modeling, animation)

• Why it fits:
→ Indian gaming industry is growing rapidly  
→ More studios + global opportunities

• Challenge:
⚠️ Needs strong mix of technical + creative skills  
⚠️ Long development hours

• Narrow it down:
→ Do you enjoy coding mechanics  
→ OR creating characters & worlds?

• Learn via YouTube:
→ https://www.youtube.com/results?search_query=career+in+gaming+india

• Official Link:
→ https://www.nid.edu`;
  } else if (lang === "Hindi") {
    if (lowerQuery.includes("college") || lowerQuery.includes("कॉलेज")) {
      reply = `🎯 कॉलेज प्रवेश

• जानकारी:
→ सरकारी कॉलेज में प्रवेश के लिए JEE परीक्षा आवश्यक है

• लक्ष्य:
✓ IIT या NIT में दाखिला`;
    } else if (lowerQuery.includes("exam") || lowerQuery.includes("परीक्षा") || lowerQuery.includes("तैयारी")) {
      reply = `🎯 परीक्षा तैयारी

• तरीका:
→ पिछले साल के प्रश्न पत्र हल करें
→ बुनियादी अवधारणाओं को समझें

• लक्ष्य:
✓ परीक्षा पैटर्न को समझना`;
    } else {
      reply = `🎯 कैरियर मार्ग

• कार्य:
→ कोडिंग सीखना
→ प्रोजेक्ट बनाना
→ समस्या समाधान सुधारना

• प्रश्न:
→ क्या आप गणित में रुचि रखते हैं?`;
    }
  } else {
    if (lowerQuery.includes("college") || lowerQuery.toLowerCase().includes("university")) {
      reply = `🎯 College Selection

• Next step:
→ Explore NIT and IIT cutoffs
→ List target states

• Goal:
✓ Shortlist 3 colleges`;
    } else if (lowerQuery.includes("exam") || lowerQuery.toLowerCase().includes("prepare") || lowerQuery.toLowerCase().includes("syllabus")) {
      reply = `🎯 Exam Prep

• Method:
→ Practice math daily
→ Solve physics concepts
→ Review chemistry notes

• Goal:
✓ Complete 1 mock test this week`;
    } else {
      reply = `🎯 Career Guidance

• Suggestion:
→ Identify your key interest area
→ Start with a small action

• Question:
→ Do you prefer working on code logic
→ Or drawing visual design layouts?`;
    }
  }

  return reply;
}


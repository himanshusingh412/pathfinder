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
  const interests = studentData.interests || [];
  
  let category = 'Default';
  if (interests.includes('Technology') || interests.includes('Science')) {
    category = 'Technology';
  } else if (interests.includes('Medicine')) {
    category = 'Medicine';
  }
  
  return MOCK_DATABASE[lang][category] || MOCK_DATABASE[lang]['Default'];
}

function getGeminiConfig() {
  const apiKey = import.meta.env.VITE_AI_API_KEY;
  const model = import.meta.env.VITE_AI_MODEL || "gemini-3.1-flash-lite";
  if (!apiKey || apiKey.trim() === '' || apiKey.startsWith('your_')) {
    return { active: false };
  }
  return { active: true, apiKey, model };
}

function getClaudeConfig() {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.startsWith('your_')) {
    return { active: false };
  }
  return { 
    active: true, 
    isOpenRouter: apiKey.startsWith('sk-or-'), 
    key: apiKey 
  };
}

function getClaudeHeaders(claudeConfig) {
  if (claudeConfig.isOpenRouter) {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${claudeConfig.key}`
    };
  }
  return {
    "Content-Type": "application/json",
    "x-api-key": claudeConfig.key,
    "anthropic-version": "2023-06-01",
    "dangerously-allow-browser": "true"
  };
}

/**
 * Robust JSON extraction from LLM outputs.
 * Parses character-by-character from the first '{', tracking brace depth
 * and string escaping to find the exact matching closing brace '}'.
 */
function extractJSON(text) {
  const start = text.indexOf('{');
  if (start === -1) {
    throw new Error("Could not find any JSON start bracket '{' in the response.");
  }
  
  const endIndices = [];
  for (let i = start; i < text.length; i++) {
    if (text[i] === '}') {
      endIndices.push(i);
    }
  }
  
  let lastError = null;
  for (let i = endIndices.length - 1; i >= 0; i--) {
    const endIdx = endIndices[i];
    const jsonStr = text.substring(start, endIdx + 1);
    try {
      return JSON.parse(jsonStr);
    } catch (err) {
      lastError = err;
    }
  }
  
  throw lastError || new Error("Could not find a valid JSON object in the response.");
}

/**
 * Generates a career roadmap based on student data.
 * @param {Object} studentData 
 * @returns {Promise<Object>} The parsed roadmap JSON.
 */
export async function generateCareerRoadmap(studentData) {
  const geminiConfig = getGeminiConfig();
  const claudeConfig = getClaudeConfig();

  const systemPrompt = `You are an expert career counselor for Indian students. The student may NOT fully understand their interests yet. Your job is to guide them step-by-step.

STEP 1: INTEREST DISCOVERY
- Infer hidden interests from subjects, marks, and inputs
- Expand into 2-3 deeper directions

STEP 2: EXPLAIN FIT
- Why each direction fits the student

STEP 3: EXPLORATION
- Give 3 small, low-commitment actions to test each interest this week

STEP 4: CAREER PATHS
- Suggest 2-3 specific career paths only AFTER exploration

STEP 5: EXAMS (IMPORTANT)
For each exam, include:
- name
- description
- eligibility
- officialLink (REAL official site only, never invent links, only official sources like NTA, UPSC, govt, or official university websites. No coaching/blog links)
- youtubeSearch (useful preparation search query)

STEP 6: ROADMAP + SKILLS + COLLEGES

You must respond in the student's selected language: ${studentData.language || "English"}.
If the language is Hindi, output all text in Hindi using Devanagari script, but keep standard English names for exams (e.g. JEE, NEET), officialLinks, colleges, and technologies for clarity.

You MUST respond ONLY with a valid JSON object matching the exact schema below. Do not wrap it in markdown codeblocks, do not add any introduction or notes. Output ONLY raw JSON.

Schema:
{
  "interestDiscovery": [
    {
      "interest": "string",
      "whyItFits": "string",
      "subFields": ["string"],
      "tryThisWeek": ["string"]
    }
  ],
  "careerPaths": [
    {
      "title": "string",
      "description": "string",
      "salaryRange": "string",
      "demandLevel": "High" | "Medium" | "Low"
    }
  ],
  "roadmap": [
    {
      "step": number,
      "title": "string",
      "description": "string",
      "duration": "string"
    }
  ],
  "exams": [
    {
      "name": "string",
      "description": "string",
      "eligibility": "string",
      "officialLink": "string (REAL official URL only)",
      "youtubeSearch": "string (Useful preparation query)"
    }
  ],
  "colleges": [
    {
      "name": "string",
      "location": "string",
      "ranking": "string",
      "type": "Government" | "Private"
    }
  ],
  "skills": [
    {
      "name": "string",
      "importance": "Must Have" | "Good to Have",
      "resources": "string"
    }
  ]
}`;

  const userPrompt = `Student Profile:
- Name: ${studentData.name}
- Class/Standard: Class ${studentData.studentClass}
- Subjects Studied: ${studentData.subjects}
- Overall Marks Percentage (%): ${studentData.marks}
- Interests: ${studentData.interests.join(", ")}
- Preferred Language: ${studentData.language}
- Current Location: ${studentData.location}

Please generate the roadmap matching the strict JSON schema.`;

  // 1. RUN GEMINI FLOW IF CONFIGURED
  if (geminiConfig.active) {
    console.log("Generating roadmap using Gemini API Model:", geminiConfig.model);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiConfig.model}:generateContent?key=${geminiConfig.apiKey}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: userPrompt }]
          }
        ],
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Request Failed with status ${response.status}: ${errText}`);
    }

    const resData = await response.json();
    const textContent = resData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textContent) {
      throw new Error("Received empty response from Gemini API.");
    }
    
    return extractJSON(textContent);
  }

  // 2. RUN CLAUDE FLOW IF CONFIGURED
  if (claudeConfig.active) {
    console.log("Generating roadmap using Claude/OpenRouter API");
    const headers = getClaudeHeaders(claudeConfig);
    const url = claudeConfig.isOpenRouter ? OPENROUTER_API_URL : CLAUDE_API_URL;
    
    const body = claudeConfig.isOpenRouter 
      ? JSON.stringify({
          model: "anthropic/claude-3.5-sonnet",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ]
        })
      : JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 4000,
          system: systemPrompt,
          messages: [
            { role: "user", content: userPrompt }
          ]
        });

    const response = await fetch(url, {
      method: "POST",
      headers,
      body
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude API request failed with status ${response.status}: ${errorText}`);
    }

    const responseData = await response.json();
    const textContent = claudeConfig.isOpenRouter 
      ? responseData.choices[0]?.message?.content 
      : responseData.content[0]?.text;

    if (!textContent) {
      throw new Error("Received empty response from Claude API.");
    }

    return extractJSON(textContent);
  }

  // 3. OFFLINE MOCK FALLBACK MODE
  console.log("PathfinderAI running in OFFLINE mock mode.");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getOfflineMockRoadmap(studentData));
    }, 1500);
  });
}

/**
 * Sends a chat message to the counselor bot.
 * @param {Array} messages 
 * @param {string} studentContext 
 * @returns {Promise<string>} The assistant's text response.
 */
export async function sendChatMessage(messages, studentContext) {
  const geminiConfig = getGeminiConfig();
  const claudeConfig = getClaudeConfig();

  const systemPrompt = `You are an AI career counselor. Your job is to respond in a way that feels like a real assistant speaking step-by-step.

The student context is: ${studentContext}

⚡ OUTPUT STYLE (STRICT):
- NEVER write long paragraphs.
- ALWAYS break your response into small lines.
- Each line must be short (exactly 1 idea per line).
- Each line should be on a NEW LINE.
- Add double line breaks (spacing) between sections.

📌 FORMAT RULES:
- Use these symbols at the START of lines only:
  🎯 for titles
  • for points
  → for explanation
  ⚠️ for challenges
  ✓ for goals

🧠 LINE BREAKING RULE:
- Do NOT combine multiple thoughts or actions in a single line.
Instead of:
"→ Learn coding and build projects while improving logic"
You MUST write:
"→ Learn coding
→ Build projects
→ Improve logic"

🤖 FLOATING BOT BEHAVIOR:
- Do NOT dump everything at once. Break your response into step-by-step guided directions.
- Keep it natural, calm, and conversational, like you are speaking slowly.

🔗 LINKS:
- Provide links in this exact structure:
  • Official Link:
  → https://example.com (only real official NTA, UPSC, government, or university links)
  • Learn via YouTube:
  → https://www.youtube.com/results?search_query=...

LANGUAGE RULE:
- Respond in the student's language specified in the context (Hindi or English). If Hindi, use natural, clean Devnagari script but keep technical words (exams, colleges, technologies) in English script or standard transliteration for clarity.

STRICTLY AVOID:
- Long paragraphs or dense text blocks.
- Markdown styles like ### or **. Do NOT write bold or header tags.
- Over-explaining.`;

  // 1. RUN GEMINI FLOW IF CONFIGURED
  if (geminiConfig.active) {
    console.log("Chatting using Gemini API Model:", geminiConfig.model);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiConfig.model}:generateContent?key=${geminiConfig.apiKey}`;
    
    const contents = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API request failed with status ${response.status}: ${errText}`);
    }

    const resData = await response.json();
    return resData.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }

  // 2. RUN CLAUDE FLOW IF CONFIGURED
  if (claudeConfig.active) {
    console.log("Chatting using Claude/OpenRouter API");
    const headers = getClaudeHeaders(claudeConfig);
    const url = claudeConfig.isOpenRouter ? OPENROUTER_API_URL : CLAUDE_API_URL;
    
    const apiMessages = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    const body = claudeConfig.isOpenRouter 
      ? JSON.stringify({
          model: "anthropic/claude-3.5-sonnet",
          messages: [
            { role: "system", content: systemPrompt },
            ...apiMessages
          ]
        })
      : JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1500,
          system: systemPrompt,
          messages: apiMessages
        });

    const response = await fetch(url, {
      method: "POST",
      headers,
      body
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude API request failed with status ${response.status}: ${errorText}`);
    }

    const responseData = await response.json();
    const reply = claudeConfig.isOpenRouter 
      ? responseData.choices[0]?.message?.content 
      : responseData.content[0]?.text;

    if (!reply) {
      throw new Error("Received empty reply from Claude API.");
    }

    return reply;
  }

  // 3. OFFLINE MOCK FALLBACK
  const context = JSON.parse(studentContext);
  const lang = context.studentData?.language || "English";
  const studentName = context.studentData?.name || "Student";
  const lastUserQuery = messages[messages.length - 1]?.content || "";
  const lowerQuery = lastUserQuery.toLowerCase();

  return new Promise((resolve) => {
    setTimeout(() => {
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
      resolve(reply);
    }, 1000);
  });
}

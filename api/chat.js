export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, studentContext } = req.body || {};
  if (!messages || !studentContext) {
    return res.status(400).json({ error: 'messages and studentContext are required' });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const geminiModel = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
  const claudeApiKey = process.env.CLAUDE_API_KEY;

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

  try {
    // 1. Run Gemini Flow if key is present
    if (geminiApiKey && geminiApiKey.trim() !== '' && !geminiApiKey.startsWith('your_')) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;
      
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
        throw new Error(`Gemini API Request Failed: ${errText}`);
      }

      const resData = await response.json();
      const replyText = resData.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return res.status(200).json({ reply: replyText });
    }

    // 2. Run Claude Flow if key is present
    if (claudeApiKey && claudeApiKey.trim() !== '' && !claudeApiKey.startsWith('your_')) {
      const isOpenRouter = claudeApiKey.startsWith('sk-or-');
      const url = isOpenRouter ? "https://openrouter.ai/api/v1/chat/completions" : "https://api.anthropic.com/v1/messages";
      
      const headers = isOpenRouter 
        ? {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${claudeApiKey}`
          }
        : {
            "Content-Type": "application/json",
            "x-api-key": claudeApiKey,
            "anthropic-version": "2023-06-01"
          };

      const apiMessages = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      const body = isOpenRouter 
        ? JSON.stringify({
            model: "anthropic/claude-3.5-sonnet",
            messages: [
              { role: "system", content: systemPrompt },
              ...apiMessages
            ]
          })
        : JSON.stringify({
            model: "claude-3-5-sonnet-20241022",
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
        throw new Error(`Claude API request failed: ${errorText}`);
      }

      const responseData = await response.json();
      const replyText = isOpenRouter 
        ? responseData.choices[0]?.message?.content 
        : responseData.content[0]?.text;

      if (!replyText) {
        throw new Error("Received empty reply from Claude API.");
      }

      return res.status(200).json({ reply: replyText });
    }

    // 3. Fallback to Mock Data if no keys configured
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
      if (lowerQuery.includes("code") || lowerQuery.includes("logic") || lowerQuery.includes("develop") || lowerQuery.includes("software") || lowerQuery.includes("कोडिंग")) {
        reply = `🎯 सॉफ्टवेयर कोडिंग और लॉजिक

• सही दिशा!
→ कोडिंग का अर्थ है समस्याओं को व्यवस्थित तरीके से हल करना।
→ सॉफ्टवेयर डेवलपर्स की मांग हमेशा बहुत अधिक रहती है।

• कदम:
→ किसी एक भाषा (जैसे Python या JavaScript) से शुरुआत करें।
→ छोटे कोडिंग अभ्यास हल करें।

• प्रश्न:
→ क्या आपने पहले कभी कोडिंग का प्रयास किया है, या यह आपकी पहली बार है?`;
      } else if (lowerQuery.includes("design") || lowerQuery.includes("visual") || lowerQuery.includes("layout") || lowerQuery.includes("figma") || lowerQuery.includes("art") || lowerQuery.includes("डिजाइन")) {
        reply = `🎯 UI/UX डिजाइन और क्रिएटिव क्षेत्र

• शानदार विचार!
→ डिजिटल प्रोडक्ट्स को सुंदर और उपयोगी बनाना ही डिजाइनिंग है।
→ यह कोडिंग और कलात्मक सौंदर्य का एक बेहतरीन संयोजन है।

• कदम:
→ Figma या Canva ऐप चलाकर बुनियादी चीजें सीखें।
→ लोकप्रिय ऐप्स के लेआउट का अध्ययन करें।

• प्रश्न:
→ क्या आपको रंग चुनना और दृश्य डिजाइन बनाना पसंद है?`;
      } else if (lowerQuery.includes("college") || lowerQuery.includes("कॉलेज")) {
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
      } else if (lowerQuery.includes("yes") || lowerQuery.includes("tried") || lowerQuery.includes("हाँ") || lowerQuery.includes("किया")) {
        reply = `🎯 व्यावहारिक अभ्यास

• बहुत बढ़िया!
→ व्यावहारिक अभ्यास सीखने का सबसे तेज़ तरीका है।

• कदम:
→ सरल प्रोजेक्ट बनाएं (जैसे पर्सनल वेबसाइट)।
→ अपनी कोडिंग को Git/GitHub पर रखें।

• प्रश्न:
→ आपने किस कोडिंग प्रोजेक्ट या विषय पर काम किया?`;
      } else if (lowerQuery.includes("first time") || lowerQuery.includes("no") || lowerQuery.includes("never") || lowerQuery.includes("नहीं") || lowerQuery.includes("पहली")) {
        reply = `🎯 शुरुआत करना

• कोई बात नहीं!
→ हर सफल इंजीनियर शून्य से शुरुआत करता है।
→ सीखने के लिए पहले से अनुभव होना ज़रूरी नहीं है।

• कदम:
→ YouTube चैनलों (जैसे code.org) से बुनियादी बातें सीखें।

• प्रश्न:
→ क्या आप पहले टेक एक्सप्लोर करना चाहेंगे, या बिज़नेस और डिज़ाइन?`;
      } else {
        reply = `🎯 कैरियर मार्ग मार्गदर्शन

• सुझाव:
→ अपने पसंदीदा रुचि क्षेत्र को पहचानें।
→ एक छोटे से कदम से शुरुआत करें।

• प्रश्न:
→ क्या आप कोड लॉजिक (कोडिंग) पर काम करना पसंद करते हैं
→ या विज़ुअल डिज़ाइन लेआउट (डिजाइनिंग) बनाना?`;
      }
    } else {
      if (lowerQuery.includes("code") || lowerQuery.includes("logic") || lowerQuery.includes("develop") || lowerQuery.includes("software") || lowerQuery.includes("coding")) {
        reply = `🎯 Software Development & Logic

• Great choice!
→ Coding is all about building structured solutions.
→ The demand for developers continues to be very high.

• Action Step:
→ Learn basic programming languages (like Python or JavaScript).
→ Start with small coding challenges.

• Question:
→ Have you ever tried writing a line of code, or is this your first time?`;
      } else if (lowerQuery.includes("design") || lowerQuery.includes("visual") || lowerQuery.includes("layout") || lowerQuery.includes("figma") || lowerQuery.includes("art")) {
        reply = `🎯 UI/UX Design & Creative Paths

• Excellent direction!
→ Digital products need beautiful and functional layouts.
→ Designers bridge the gap between human needs and code.

• Action Step:
→ Try creating a simple web wireframe.
→ Play around with Figma or Canva tools to understand alignment.

• Question:
→ Do you enjoy picking color themes and designing visual look-and-feel?`;
      } else if (lowerQuery.includes("college") || lowerQuery.includes("university")) {
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

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("API error in chat:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

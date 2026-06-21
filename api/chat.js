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

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("API error in chat:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

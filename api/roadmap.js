import { getOfflineMockRoadmap, extractJSON } from './_utils/ai_helpers.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { studentData } = req.body || {};
  if (!studentData) {
    return res.status(400).json({ error: 'studentData is required' });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const geminiModel = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
  const claudeApiKey = process.env.CLAUDE_API_KEY;

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
- Interests: ${(studentData.interests || []).join(", ")}
- Preferred Language: ${studentData.language}
- Current Location: ${studentData.location}

Please generate the roadmap matching the strict JSON schema.`;

  try {
    // 1. Run Gemini Flow if key is present
    if (geminiApiKey && geminiApiKey.trim() !== '' && !geminiApiKey.startsWith('your_')) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;
      
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
        throw new Error(`Gemini API Request Failed: ${errText}`);
      }

      const resData = await response.json();
      const textContent = resData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textContent) {
        throw new Error("Received empty response from Gemini API.");
      }
      
      const parsedData = extractJSON(textContent);
      return res.status(200).json(parsedData);
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

      const body = isOpenRouter 
        ? JSON.stringify({
            model: "anthropic/claude-3.5-sonnet",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ]
          })
        : JSON.stringify({
            model: "claude-3-5-sonnet-20241022",
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
        throw new Error(`Claude API request failed: ${errorText}`);
      }

      const responseData = await response.json();
      const textContent = isOpenRouter 
        ? responseData.choices[0]?.message?.content 
        : responseData.content[0]?.text;

      if (!textContent) {
        throw new Error("Received empty response from Claude API.");
      }

      const parsedData = extractJSON(textContent);
      return res.status(200).json(parsedData);
    }

    // 3. Fallback to Mock Data if no keys configured
    const mockData = getOfflineMockRoadmap(studentData);
    return res.status(200).json(mockData);

  } catch (error) {
    console.error("API error generating roadmap:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

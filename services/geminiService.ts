import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SummaryResult } from "../types";

// Schema definition for the structured output
const summarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A catchy title for the video content",
    },
    summary: {
      type: Type.STRING,
      description: "A comprehensive summary of the content",
    },
    keyPoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of key takeaways or bullet points",
    },
    timeline: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          time: { type: Type.STRING, description: "Timestamp, e.g., '02:30'" },
          description: { type: Type.STRING, description: "Event description" },
        },
        required: ["time", "description"],
      },
      description: "A chronological timeline of events or topics",
    },
    mindMap: {
      type: Type.OBJECT,
      description: "A hierarchical structure for a mind map visualization",
      properties: {
        name: { type: Type.STRING, description: "The central topic" },
        children: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              children: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                  }
                }
              }
            }
          }
        }
      },
      required: ["name", "children"],
    },
  },
  required: ["title", "summary", "keyPoints", "timeline", "mindMap"],
};

export const generateSummary = async (
  apiKey: string,
  transcript: string,
  conciseness: number,
  modelName: string = "gemini-2.5-flash-preview"
): Promise<SummaryResult> => {
  if (!apiKey) throw new Error("API Key is required");

  // Initialize client with user provided key
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are an expert content analyst.
    Analyze the following video transcript.
    
    Conciseness Level: ${conciseness}/100
    (Low = Detailed, High = Brief/Abstract)

    Generate a structured output containing:
    1. A Title.
    2. A Summary paragraph.
    3. Key Bullet points.
    4. A Timeline of topics.
    5. A hierarchical Mind Map structure (Root -> Main Topics -> Subtopics).

    Transcript:
    ${transcript}
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: summarySchema,
        temperature: 0.3,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as SummaryResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
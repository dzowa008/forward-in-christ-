import { GoogleGenAI, Type } from "@google/genai";
import { KidsStory } from "../types";

// Initialize the API client
// Note: In a real production app, this should be proxied through a backend to protect the key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const modelFlash = 'gemini-2.5-flash';

export const getShepherdAdvice = async (query: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: modelFlash,
      contents: query,
      config: {
        systemInstruction: `You are a "Digital Shepherd", a compassionate, biblical AI assistant for a church community in Zimbabwe. 
        Your goal is to provide spiritual comfort, relevant Bible verses, and practical wisdom. 
        Use the King James Version or New King James Version. 
        Be culturally aware of Zimbabwean context (respectful, community-focused).
        If the query is about mental health crisis, gently suggest professional help alongside prayer.`,
      }
    });
    return response.text || "I am meditating on your request. Please try again in a moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The Shepherd is currently unavailable. Please check your connection.";
  }
};

export const summarizeSermonText = async (transcript: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: modelFlash,
      contents: `Summarize this sermon transcript into 3 key takeaways and a practical application point:\n\n${transcript}`,
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini Summarizer Error:", error);
    return "Unable to summarize at this time.";
  }
};

export const generateKidsStory = async (topic: string): Promise<KidsStory | null> => {
  try {
    const response = await ai.models.generateContent({
      model: modelFlash,
      contents: `Write a short 3-page children's story about: ${topic}. 
      The story must be biblical, moral, and safe for children.
      Output strictly JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            pages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  imageUrl: { type: Type.STRING, description: "A detailed description of the scene for an image generator (placeholder)" } 
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
        const data = JSON.parse(response.text);
        // Since we don't have a real image generator connected in this demo, 
        // we will map the descriptions to placeholder images.
        const enhancedPages = data.pages.map((page: any, index: number) => ({
            ...page,
            imageUrl: `https://picsum.photos/seed/${encodeURIComponent(topic + index)}/800/600`
        }));
        return { ...data, pages: enhancedPages };
    }
    return null;

  } catch (error) {
    console.error("Gemini Story Error:", error);
    return null;
  }
};

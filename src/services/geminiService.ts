import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface StylingSuggestion {
  headline: string;
  subheadline: string;
  description: string;
  recommendedItems: string[]; // e.g., ["White Linen Shirt", "Light Blue Shorts"]
  weatherInfo: {
    temp: string;
    condition: string;
    uvIndex: string;
  };
}

export async function getStylingSuggestion(location: string = "San Francisco"): Promise<StylingSuggestion> {
  const prompt = `
    Current location: ${location}.
    1. Search for the current weather in ${location} using Google Search.
    2. Based on the weather, provide a high-end editorial styling suggestion for a "Wardrobe" app.
    3. The suggestion should be "Clean and Airy" (icy blues, whites, minimalist).
    4. Return the response in the following JSON format:
    {
      "headline": "Today's Coolest Fit",
      "subheadline": "CURATED FOR THE HEAT",
      "description": "A minimalist approach to summer layering.",
      "recommendedItems": ["White Linen Shirt", "Light Blue Shorts"],
      "weatherInfo": {
        "temp": "85°F",
        "condition": "Sunny and Humid",
        "uvIndex": "8"
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text) as StylingSuggestion;
  } catch (error) {
    console.error("Error getting styling suggestion:", error);
    // Fallback data
    return {
      headline: "Today's Coolest Fit",
      subheadline: "CURATED FOR THE HEAT",
      description: "A minimalist approach to summer layering.",
      recommendedItems: ["White Linen Shirt", "Light Blue Shorts"],
      weatherInfo: {
        temp: "85°F",
        condition: "Sunny and Humid",
        uvIndex: "8"
      }
    };
  }
}

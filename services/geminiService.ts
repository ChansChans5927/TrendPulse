import { GoogleGenAI } from "@google/genai";
import { Region, TrendResponse, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const fetchTrends = async (region: Region): Promise<TrendResponse> => {
  const modelId = "gemini-2.5-flash";

  const prompt = `
    Find the top 8 current trending topics, news, or viral content in ${region} right now.
    Focus on what is popular within the last 24 hours.
    
    Return the response strictly as a VALID JSON object (no markdown formatting) with the following structure:
    {
      "trends": [
        {
          "rank": 1,
          "keyword": "Trend Name (Translate to Korean)",
          "category": "Technology|Entertainment|Politics|Sports|Lifestyle (Translate to Korean)",
          "volume": 95, 
          "description": "Short summary of why it is trending (max 15 words) in Korean."
        }
      ]
    }
    
    Ensure all text fields (keyword, category, description) are in Korean language.
    "volume" should be an estimated relative interest score between 0 and 100 based on the search intensity.
    Sort by rank.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
        topP: 0.9,
        topK: 50,
      },
    });

    let text = response.text;
    if (!text) {
      throw new Error("Gemini로부터 데이터를 받지 못했습니다.");
    }

    // 마크다운 코드 블록(```json ... ```)이 포함된 경우 제거
    text = text
      .replace(/^```json\s*/, "")
      .replace(/^```\s*/, "")
      .replace(/\s*```$/, "");

    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch (e) {
      console.error("JSON Parse Error:", e);
      console.log("Raw Text:", text);
      throw new Error("데이터 형식이 올바르지 않습니다.");
    }

    // Extract grounding metadata to show sources
    const sources: GroundingSource[] = [];
    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri,
          });
        }
      });
    }

    // Deduplicate sources based on URI
    const uniqueSources = Array.from(
      new Map(sources.map((s) => [s.uri, s])).values(),
    ).slice(0, 5);

    return {
      trends: parsedData.trends || [],
      sources: uniqueSources,
      timestamp: new Date().toLocaleTimeString(),
    };
  } catch (error) {
    console.error(`Error fetching trends for ${region}:`, error);
    throw error;
  }
};

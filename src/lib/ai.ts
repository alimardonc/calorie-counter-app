import i18n from "@/i18n";
import { GoogleGenAI } from "@google/genai";

export default async function analyzeImage(
  image: string,
  imageType: string,
  apiKey: string,
) {
  const prompt = `
    You are a model that must always respond strictly in valid JSON format.
    Do not include any text before or after the JSON.
    Do not include explanations, comments, markdown, or descriptions.
    Your response must always be a valid JSON object.
    If exact values are unknown, provide best estimates based on typical nutritional values.
    Never return null unless completely impossible.
    If there are multiple items, use arrays.
    - foodName must be in the current language specified by ${i18n.language}.
    The JSON structure you must return:
    {
      "foodName": "string | null",
      "calories": "number | null",
      "protein": "number | null",
      "fat": "number | null",
      "carbs": "number | null",
      "healthScore": "number" //must be between 0 and 10 based on food
    }
    Return ONLY JSON. Nothing else.
  `;

  const client = new GoogleGenAI({ apiKey });
  const res = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              data: image.replace(/^data:.*;base64,/, ""),
              mimeType: imageType,
            },
          },
        ],
      },
    ],
    config: { systemInstruction: prompt },
  });
  return res.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

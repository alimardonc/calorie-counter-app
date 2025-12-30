import i18n from "@/i18n";
import { GoogleGenAI } from "@google/genai";

export default async function analyzeImage(
  image: string,
  imageType: string,
  apiKey: string,
  userPrompt?: string,
) {
  const prompt = `
    You are a food-analysis model. You must ALWAYS return valid JSON only.

    You receive three inputs:
    - visionDescription: model's description of what is visible in the image
    - detectedText: any OCR text found on the image (may be empty)
    - userPrompt: user text input (may be empty) - ${userPrompt}

    Your job:
    1. Determine the most likely single food item in the image.
    2. If userPrompt contains weight or a food name, USE IT.
    3. If detectedText (OCR) contains weight, use it if userPrompt did not override it.
    4. If no weight is provided, estimate a typical portion size for the detected food.
    5. Never hallucinate ingredients that are not visible.
    6. foodName, servingDescription, category, mealType, macroProfile, ingredients must be in language: ${i18n.language}.
    7. ALWAYS return JSON. No comments, no explanations, no markdown.

    The JSON structure you must return:
    {
      "foodName": "string | null",
      "calories": number | null,
      "protein": number | null,
      "fat": number | null,
      "carbs": number | null,
      "sugar": number | null,
      "fiber": number | null,
      "weight": number | null,
      "servingUnit": "string | null",
      "servingDescription": "string | null",
      "category": "string | null",
      "ingredients": [ "string" ] | null,
      "mealType": "string", //about meal type dinner, lunch, snack, breakfast must be in ${i18n.language} language
      "macroProfile": "string",
      "dietCompatibility": [ "string" ] | null,
      "confidence": number, //must be between 0 and 10 based on food
      "healthScore": "number" //must be between 0 and 10 based on food
    }
    Return ONLY JSON. Nothing else.
  `;

  const client = new GoogleGenAI({ apiKey });
  const res = await client.models.generateContent({
    model: "gemini-2.5-flash-lite",
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

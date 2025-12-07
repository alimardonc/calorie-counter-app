import { GoogleGenAI } from "@google/genai";

export class AiClient {
  private client: GoogleGenAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenAI({ apiKey });
  }

  async analyzeImage(image: string, imageType: string, prompt: string) {
    const res = await this.client.models.generateContent({
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

    return res.text;
  }
}

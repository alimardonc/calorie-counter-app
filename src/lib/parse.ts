import type { IFood } from "@/types";

export function extractJson(text: string): IFood[] {
  const cleaned = text
    .replace(/```json/i, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  return Array.isArray(parsed) ? parsed : [parsed];
}

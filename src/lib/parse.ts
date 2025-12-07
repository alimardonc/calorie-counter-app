export function extractJson(text: string) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON object found");
  const json = match[0];
  const parsed = JSON.parse(json);
  return Array.isArray(parsed) ? parsed : [parsed];
}

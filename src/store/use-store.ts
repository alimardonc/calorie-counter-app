import type { IFood, INutritionalFact, IUserInfo } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useCalendarStore } from "./use-calendar";
import { GoogleGenAI } from "@google/genai";
import { v4 as uuid } from "uuid";
import i18n from "@/i18n";
import { getNutFact } from "@/lib/utils";

interface CalorieStore {
  user: IUserInfo | null;
  nutFact: INutritionalFact;
  apiKey: string;
  setApiKey: (key: string) => void;
  analyzeFood: (image: string, imageType: string) => void;
  setUser: (user: IUserInfo) => void;
  clearUser: () => void;
  recalcCalories: () => void;
  foodStats: Record<string, IFood[]>;
  setFoodStats: (stats: IFood) => void;
  isAnalyzing: boolean;
  userStats: Record<string, INutritionalFact>;
  initUserStats: (key: string) => void;
  deleteFood: (id: string) => void;
}

export const useStore = create<CalorieStore>()(
  persist(
    (set, get) => {
      let genAI: GoogleGenAI | null = null;

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

      const extractJsonFromGemini = (text: string): IFood[] => {
        const cleaned = text
          .replace(/```json/i, "")
          .replace(/```/g, "")
          .trim();

        const parsed = JSON.parse(cleaned);

        return Array.isArray(parsed) ? parsed : [parsed];
      };

      return {
        user: null,
        nutFact: { protein: 0, carbs: 0, fat: 0, calories: 0 },
        apiKey:
          JSON.parse(localStorage.getItem("calorie-storage") || "{}")?.state
            ?.user?.api_key || "",
        setApiKey: (key: string) => {
          set({ apiKey: key });
          genAI = new GoogleGenAI({ apiKey: key });
        },
        analyzeFood: async (image: string, imageType: string) => {
          if (!genAI) {
            const key = get().apiKey;
            if (!key) {
              set({ user: null, apiKey: "" });
              throw new Error("API key not set");
            }
            genAI = new GoogleGenAI({ apiKey: key });
          }
          set({ isAnalyzing: true });
          try {
            const response = await genAI.models.generateContent({
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
              config: {
                systemInstruction: prompt,
              },
            });

            const data = extractJsonFromGemini(response.text + "");
            data.map((e) => {
              get().setFoodStats({
                ...e,
                image,
                createdAt: new Date().toString(),
                id: uuid(),
              });
            });
            set({ isAnalyzing: false });
          } catch (error) {
            console.error(error);
          }
        },
        setUser: (user) => {
          set({ user, apiKey: user.api_key });
          const nutFact = getNutFact(user);
          set({ nutFact });
        },
        userStats: {},
        initUserStats: (key) => {
          set({
            userStats: {
              ...get().userStats,
              [key]: {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
              },
            },
          });
        },
        isAnalyzing: false,
        deleteFood: (id) => {
          const key = useCalendarStore.getState().selectedDate;
          const day = get().foodStats[key] ?? [];
          const filtered = day.filter((f) => f.id !== id);
          const deletedItem = day.find((f) => f.id === id);
          if (!deletedItem) return;
          const cur = get().userStats[key];
          set({
            foodStats: {
              ...get().foodStats,
              [key]: filtered,
            },
            userStats: {
              ...get().userStats,
              [key]: {
                ...cur,
                calories: cur.calories - deletedItem.calories,
                protein: cur.protein - deletedItem.protein,
                carbs: cur.carbs - deletedItem.carbs,
                fat: cur.fat - deletedItem.fat,
              },
            },
          });
        },
        setFoodStats: (stats) => {
          const key = useCalendarStore.getState().selectedDate;

          const prevDay = get().foodStats[key] ?? [];
          const prevStats = get().userStats[key] ?? {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
          };

          set({
            foodStats: {
              ...get().foodStats,
              [key]: [...prevDay, stats],
            },
            userStats: {
              ...get().userStats,
              [key]: {
                calories: prevStats.calories + stats.calories,
                protein: prevStats.protein + stats.protein,
                carbs: prevStats.carbs + stats.carbs,
                fat: prevStats.fat + stats.fat,
              },
            },
          });
        },
        foodStats: {},
        clearUser: () =>
          set({
            user: null,
            nutFact: { calories: 0, protein: 0, carbs: 0, fat: 0 },
            foodStats: {},
            userStats: {},
            isAnalyzing: false,
          }),
        recalcCalories: () => {
          const user = get().user;
          if (user) {
            const nutFact = getNutFact(user);
            set({ nutFact });
          }
        },
      };
    },
    {
      name: "calorie-storage",
    },
  ),
);

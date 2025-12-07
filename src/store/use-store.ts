import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AiClient } from "@/lib/ai";
import { extractJson } from "@/lib/parse";
import { getNutFact } from "@/lib/utils";
import { v4 as uuid } from "uuid";
import i18n from "@/i18n";
import type { IFood, INutritionalFact, IUserInfo } from "@/types";
import { useCalendarStore } from "./use-calendar";

interface CalorieStore {
  user: IUserInfo | null;
  nutFact: INutritionalFact;
  apiKey: string;
  ai: AiClient | null;
  isAnalyzing: boolean;

  foodStats: Record<string, IFood[]>;
  userStats: Record<string, INutritionalFact>;

  setApiKey: (key: string) => void;
  setUser: (u: IUserInfo) => void;
  clearUser: () => void;

  analyzeFood: (image: string, type: string) => Promise<void>;
  setFoodStats: (f: IFood) => void;
  deleteFood: (id: string) => void;

  initUserStats: (day: string) => void;
  recalcCalories: () => void;
}

const prompt = `
You must respond strictly in JSON. No text. No markdown.

{
  "foodName": "string | null",
  "calories": number,
  "protein": number,
  "fat": number,
  "carbs": number,
  "healthScore": number
}
(foodName must be in language: ${i18n.language})
`;

export const useStore = create<CalorieStore>()(
  persist(
    (set, get) => ({
      user: null,
      nutFact: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      apiKey: "",
      ai: null,
      isAnalyzing: false,
      foodStats: {},
      userStats: {},

      setApiKey: (key) => {
        set({ apiKey: key, ai: new AiClient(key) });
      },

      setUser: (user) => {
        set({
          user,
          nutFact: getNutFact(user),
        });
      },

      clearUser: () =>
        set({
          user: null,
          nutFact: { calories: 0, protein: 0, carbs: 0, fat: 0 },
          foodStats: {},
          userStats: {},
        }),

      analyzeFood: async (image, type) => {
        const ai = get().ai;
        if (!ai) throw new Error("API key not set");

        set({ isAnalyzing: true });

        try {
          const text = await ai.analyzeImage(image, type, prompt);
          const items = extractJson(text + "");

          items.forEach((food) =>
            get().setFoodStats({
              ...food,
              id: uuid(),
              image,
              createdAt: new Date().toISOString(),
            }),
          );
        } finally {
          set({ isAnalyzing: false });
        }
      },

      initUserStats: (day) => {
        set({
          userStats: {
            ...get().userStats,
            [day]: { calories: 0, protein: 0, carbs: 0, fat: 0 },
          },
        });
      },

      setFoodStats: (food) => {
        const day = useCalendarStore.getState().selectedDate;

        const prevList = get().foodStats[day] ?? [];
        const prevStats = get().userStats[day] ?? {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        };

        set({
          foodStats: {
            ...get().foodStats,
            [day]: [...prevList, food],
          },
          userStats: {
            ...get().userStats,
            [day]: {
              calories: prevStats.calories + food.calories,
              protein: prevStats.protein + food.protein,
              carbs: prevStats.carbs + food.carbs,
              fat: prevStats.fat + food.fat,
            },
          },
        });
      },

      deleteFood: (id) => {
        const day = useCalendarStore.getState().selectedDate;
        const list = get().foodStats[day] ?? [];

        const deleted = list.find((f) => f.id === id);
        if (!deleted) return;

        set({
          foodStats: {
            ...get().foodStats,
            [day]: list.filter((f) => f.id !== id),
          },
          userStats: {
            ...get().userStats,
            [day]: {
              calories: get().userStats[day].calories - deleted.calories,
              protein: get().userStats[day].protein - deleted.protein,
              carbs: get().userStats[day].carbs - deleted.carbs,
              fat: get().userStats[day].fat - deleted.fat,
            },
          },
        });
      },

      recalcCalories: () => {
        if (get().user) {
          set({ nutFact: getNutFact(get().user!) });
        }
      },
    }),
    { name: "calorie-storage" },
  ),
);

import { create } from "zustand";
import { persist } from "zustand/middleware";
import analyzeImage from "@/lib/ai";
import { extractJson } from "@/lib/parse";
import { getNutFact } from "@/lib/utils";
import { v4 as uuid } from "uuid";
import type { IFood, INutritionalFact, IUserInfo } from "@/types";
import { useCalendarStore } from "./use-calendar";

interface CalorieStore {
  user: IUserInfo | null;
  nutFact: INutritionalFact;
  apiKey: string;

  foodStats: Record<string, IFood[]>;
  userStats: Record<string, INutritionalFact>;

  setApiKey: (key: string) => void;
  setUser: (u: IUserInfo) => void;
  clearUser: () => void;

  analyzeFood: (
    image: string,
    type: string,
    userPrompt: string,
  ) => Promise<void>;
  retryAnalyzeFood: (id: string, userPrompt: string) => Promise<void>;
  setFoodStats: (f: IFood) => void;
  deleteFood: (id: string) => void;
  updateFood: (id: string, updates: Partial<IFood>) => void;

  initUserStats: (day: string) => void;
  recalcCalories: () => void;
  updateUser: (updates: Partial<IUserInfo>) => void;
}

export const useStore = create<CalorieStore>()(
  persist(
    (set, get) => ({
      user: null,
      nutFact: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      apiKey: "",
      foodStats: {},
      userStats: {},

      setApiKey: (key) => {
        set({ apiKey: key });
      },

      setUser: (user) => {
        set({
          user,
          nutFact: getNutFact(user),
        });
      },

      updateUser: (updates: Partial<IUserInfo>) =>
        set((state) => ({
          ...state,
          user: state.user ? { ...state.user, ...updates } : state.user,
        })),

      clearUser: () =>
        set({
          user: null,
          nutFact: { calories: 0, protein: 0, carbs: 0, fat: 0 },
          foodStats: {},
          userStats: {},
        }),

      analyzeFood: async (image, type, userPrompt) => {
        const apiKey = get().apiKey;
        if (!apiKey) throw new Error("API key not set");

        const tempId = uuid();
        const day = useCalendarStore.getState().selectedDate;

        const tempFood: IFood = {
          id: tempId,
          foodName: "Analyzing...",
          image,
          isLoading: true,
          isRetry: false,
          createdAt: new Date().toISOString(),
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          healthScore: 0,
          imageType: type,
        };

        const prevList = get().foodStats[day] ?? [];
        set({
          foodStats: {
            ...get().foodStats,
            [day]: [...prevList, tempFood],
          },
        });

        try {
          const text = await analyzeImage(image, type, apiKey, userPrompt);
          const items = extractJson(text + "");

          get().deleteFood(tempId);

          items.forEach((food) =>
            get().setFoodStats({
              ...food,
              id: uuid(),
              image,
              isLoading: false,
              isRetry: false,
              createdAt: new Date().toISOString(),
            }),
          );
        } catch (error) {
          get().updateFood(tempId, {
            isLoading: false,
            isRetry: true,
            foodName: "Analysis failed",
          });
          throw error;
        }
      },

      retryAnalyzeFood: async (id: string, userPrompt: string) => {
        const day = useCalendarStore.getState().selectedDate;
        const list = get().foodStats[day] ?? [];
        const food = list.find((f) => f.id === id);

        if (!food) throw new Error("Food not found");

        const apiKey = get().apiKey;
        if (!apiKey) throw new Error("API key not set");

        get().updateFood(id, {
          isLoading: true,
          isRetry: false,
          foodName: "Analyzing...",
        });

        try {
          const text = await analyzeImage(
            food.image,
            food.imageType,
            apiKey,
            userPrompt,
          );
          const items = extractJson(text + "");

          get().deleteFood(id);

          items.forEach((newFood) =>
            get().setFoodStats({
              ...newFood,
              id: uuid(),
              image: food.image,
              isLoading: false,
              isRetry: false,
              createdAt: food.createdAt,
            }),
          );
        } catch (error) {
          get().updateFood(id, {
            isLoading: false,
            isRetry: true,
            foodName: "Analysis failed",
          });
          throw error;
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

      updateFood: (id, updates) => {
        const day = useCalendarStore.getState().selectedDate;
        const list = get().foodStats[day] ?? [];

        set({
          foodStats: {
            ...get().foodStats,
            [day]: list.map((f) => (f.id === id ? { ...f, ...updates } : f)),
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

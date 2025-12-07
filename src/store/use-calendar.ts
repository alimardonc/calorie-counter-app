import { create } from "zustand";
import { persist } from "zustand/middleware";
import dayjs from "dayjs";

interface CalendarState {
  selectedDate: string;
  startOfWeek: string;
  setSelectedDate: (date: string) => void;
  nextWeek: () => void;
  prevWeek: () => void;
  resetWeek: () => void;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      selectedDate: new Date().toDateString(),
      startOfWeek: dayjs().startOf("week").toISOString(),

      setSelectedDate: (date) => set({ selectedDate: date }),

      nextWeek: () =>
        set({
          startOfWeek: dayjs(get().startOfWeek).add(1, "week").toISOString(),
        }),

      prevWeek: () =>
        set({
          startOfWeek: dayjs(get().startOfWeek)
            .subtract(1, "week")
            .toISOString(),
        }),

      resetWeek: () =>
        set({
          startOfWeek: dayjs().startOf("week").toISOString(),
          selectedDate: new Date().toDateString(),
        }),
    }),
    {
      name: "calendar-storage",
    },
  ),
);

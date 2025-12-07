import type { IUserInfo } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNutFact(user: IUserInfo) {
  const { gender, age, weight, height, activity, goal, weeklykg, weightgoal } =
    user;

  const bmr =
    gender === "Male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const activityMap: Record<string, number> = {
    "0": 1.2,
    "2 - 3": 1.375,
    "4 - 5": 1.55,
    "6+": 1.75,
  };

  const activityMultiplier = activityMap[activity] ?? 1.2;
  let dailyCalories = bmr * activityMultiplier;

  let safeWeeklyKg = Math.max(0, Number(weeklykg) || 0);

  if (goal === "Weight Loss" && safeWeeklyKg > 0) {
    dailyCalories -= (safeWeeklyKg * 7700) / 7;
  } else if (goal === "Muscle Gain" && safeWeeklyKg > 0) {
    dailyCalories += (safeWeeklyKg * 7700) / 7;
  } else {
    safeWeeklyKg = 0;
  }

  let proteinPerKg = 2.0;
  if (goal === "Muscle Gain") proteinPerKg = 2.2;
  if (goal === "Maintenance") proteinPerKg = 1.8;

  const protein = proteinPerKg * weight;
  const proteinCalories = protein * 4;

  const fatCalories = dailyCalories * 0.27;
  const fat = fatCalories / 9;

  const carbsCalories = dailyCalories - (proteinCalories + fatCalories);
  const carbs = carbsCalories / 4;

  let weeksNeeded = 0;
  if (weightgoal && safeWeeklyKg > 0) {
    const weightDiff = weightgoal - weight;

    if (
      (goal === "Weight Loss" && weightDiff < 0) ||
      (goal === "Muscle Gain" && weightDiff > 0)
    ) {
      weeksNeeded = Math.ceil(Math.abs(weightDiff / safeWeeklyKg));
    }
  }

  return {
    calories: Math.round(dailyCalories),
    protein: Math.round(protein),
    fat: Math.round(fat),
    carbs: Math.round(carbs),
    weeklyKg: safeWeeklyKg,
    weeksNeeded,
  };
}

export function roundNumber(
  stat: number | null | undefined,
  fact: number,
): number {
  return stat ? Math.round(stat / (fact / 100)) : 0;
}

export function getDisplayStat(stat: number | null | undefined, fact: number) {
  if (stat) {
    return Math.abs(fact - stat);
  }
  return fact;
}

export function filetoBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
}

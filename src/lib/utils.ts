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

  let activityMultiplier = 1.2;
  switch (activity) {
    case "0":
      activityMultiplier = 1.2;
      break;
    case "2 - 3":
      activityMultiplier = 1.375;
      break;
    case "4 - 5":
      activityMultiplier = 1.55;
      break;
    case "6+":
      activityMultiplier = 1.75;
      break;
  }

  let dailyCalories = bmr * activityMultiplier;

  let safeWeeklyKg = weeklykg;

  if (goal === "Weight Loss") {
    safeWeeklyKg = Math.max(Math.min(Math.abs(weeklykg), 1.0), 0.3) * -1;
    const dailyDeficit = (Math.abs(safeWeeklyKg) * 7700) / 7;
    dailyCalories -= dailyDeficit;
  } else if (goal === "Muscle Gain") {
    safeWeeklyKg = Math.max(Math.min(weeklykg, 1.0), 0.3);
    const dailySurplus = (safeWeeklyKg * 7700) / 7;
    dailyCalories += dailySurplus;
  } else {
    safeWeeklyKg = 0;
  }

  let proteinPerKg = 2.0;
  if (goal === "Muscle Gain") proteinPerKg = 2.2;
  if (goal === "Maintenance") proteinPerKg = 1.8;
  if (goal === "Weight Loss") proteinPerKg = 2.0;

  const protein = proteinPerKg * weight;
  const proteinCalories = protein * 4;

  const fatCalories = dailyCalories * 0.27;
  const fat = fatCalories / 9;

  const carbsCalories = dailyCalories - (proteinCalories + fatCalories);
  const carbs = carbsCalories / 4;

  let weeksNeeded = 0;
  if (weightgoal) {
    const weightDiff = weightgoal - weight;
    weeksNeeded = Math.ceil(Math.abs(weightDiff / safeWeeklyKg));
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

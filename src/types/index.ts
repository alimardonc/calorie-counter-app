export type ActivityLevel = "0" | "2 - 3" | "4 - 5" | "6+";
export type IGoal = "Weight Loss" | "Maintenance" | "Muscle Gain";
export type IGender = "Female" | "Male";

export interface IUserInfo {
  name?: string;
  gender: IGender;
  age: number;
  weight: number;
  height: number;
  activity: ActivityLevel;
  goal: IGoal;
  weeklykg: number;
  weightgoal: number;
}

export interface INutritionalFact {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  weeksNeeded?: number;
  weeklyKg?: number;
}

export interface IFood extends INutritionalFact {
  foodName: string;
  image: string;
  imageType: string;
  createdAt: string;
  id: string;
  healthScore: number;
  isLoading: boolean;
  isRetry: boolean;
}

import type { IGender, IGoal } from "@/types";

export interface ISelected {
  weight?: number;
  height?: number;
  age?: number;
  gender?: IGender;
  activity?: string;
  goal?: IGoal;
  weightgoal?: number;
  api_key?: string;
  weeklykg?: number;
}

export interface IStepBase<T extends keyof ISelected> {
  id: T;
  title: string;
  type: "input" | "options" | "slider";
  label?: string;
  inputtype?: "text";
  content?: {
    value: string;
    label: string;
  }[];
  contentTitles?: object;
}

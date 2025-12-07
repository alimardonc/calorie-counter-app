import { cn, getDisplayStat, roundNumber } from "@/lib/utils";
import { CircularProgress } from "./circular-progress";
import { useTranslation } from "react-i18next";
import { CalorieIcon } from "../constants/food";
import { caloriesColor } from "../constants/food";

const CalorieCard = ({
  calories,
  caloriesFact,
}: {
  calories: number;
  caloriesFact: number;
}) => {
  const { t } = useTranslation();
  const isOver = calories > caloriesFact;
  const isFull = calories - caloriesFact > 0 && calories - caloriesFact <= 100;

  return (
    <div
      className={cn(
        "border rounded-md flex justify-between items-center px-6 py-4 bg-card",
        isOver && "bg-red-950",
        isFull && "bg-green-950",
      )}
    >
      <div>
        <p className="text-4xl font-bold">
          {isOver ? calories : (getDisplayStat(calories, caloriesFact) ?? 0)}
        </p>
        <span>{t("nutfact.calories")} </span>
      </div>
      <CircularProgress
        value={isOver ? 100 : roundNumber(calories, caloriesFact)}
        icon={<CalorieIcon size={30} color={caloriesColor} />}
        color={caloriesColor}
      />
    </div>
  );
};

export default CalorieCard;

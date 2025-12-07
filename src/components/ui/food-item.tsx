import type { IFood } from "@/types";
import { useTranslation } from "react-i18next";
import {
  CalorieIcon,
  caloriesColor,
  CarbIcon,
  FatIcon,
  ProteinIcon,
} from "../constants/food";
import { carbsColor, fatColor, proteinColor } from "../constants/food";

interface IProps {
  food: IFood;
}

const FoodItem = ({ food }: IProps) => {
  const { t } = useTranslation();

  return (
    <div className={"flex bg-card rounded-[6px] h-28 transition-all"}>
      <img
        src={food.image}
        alt={food.foodName}
        className="w-28 h-full object-cover rounded-md"
      />
      <div className="flex flex-col gap-2 w-full px-4 py-2.5">
        <div className="flex justify-between w-full">
          <p className="truncate max-w-54">{food.foodName}</p>
          <p className="font-bold text-sm text-muted-foreground">
            {new Date(food.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <CalorieIcon size={22} color={caloriesColor} />
          <h3 className="text-xl">
            {food.calories} {t("nutfact.calories")}
          </h3>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-1.5">
            <ProteinIcon color={proteinColor} /> {food.protein}
            {t("g")}
          </div>
          <div className="flex items-center gap-1.5">
            <CarbIcon color={carbsColor} /> {food.carbs}
            {t("g")}
          </div>
          <div className="flex items-center gap-1.5">
            <FatIcon color={fatColor} /> {food.fat}
            {t("g")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;

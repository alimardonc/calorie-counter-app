import { useStore } from "@/store/use-store";
import { useCalendarStore } from "@/store/use-calendar";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import CalorieCard from "./ui/calorie-card";
import {
  CarbIcon,
  carbsColor,
  fatColor,
  FatIcon,
  proteinColor,
  ProteinIcon,
} from "./constants/food";
import MacroCard from "./ui/macro-card";

const InformationCards = () => {
  const userStats = useStore((state) => state.userStats);
  const initUserStats = useStore((state) => state.initUserStats);
  const nutFact = useStore((state) => state.nutFact);
  const selectedDate = useCalendarStore((state) => state.selectedDate);
  const stat = userStats[selectedDate];

  useEffect(() => {
    if (!userStats[selectedDate]) {
      initUserStats(selectedDate);
    }
  }, [selectedDate, userStats, initUserStats]);

  const { t } = useTranslation();

  return (
    <div className="mt-5 flex flex-col gap-4">
      <CalorieCard calories={stat?.calories} caloriesFact={nutFact.calories} />
      <div className="grid grid-cols-3 gap-3">
        <MacroCard
          goal={nutFact?.protein ?? 0}
          title={t("nutfact.protein")}
          stat={stat?.protein ?? 0}
          icon={<ProteinIcon size={20} color={proteinColor} />}
          color="red"
        />
        <MacroCard
          goal={nutFact?.carbs ?? 0}
          title={t("nutfact.carbs")}
          stat={20}
          icon={<CarbIcon size={20} color={carbsColor} />}
          color="yellow"
        />
        <MacroCard
          goal={nutFact?.fat ?? 0}
          title={t("nutfact.fat")}
          stat={stat?.fat ?? 0}
          icon={<FatIcon size={20} color={fatColor} />}
          color="blue"
        />
      </div>
    </div>
  );
};

export default InformationCards;

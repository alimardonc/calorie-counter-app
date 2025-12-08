import { useTranslation } from "react-i18next";
import { CircularProgress } from "./circular-progress";
import { cn, getDisplayStat, roundNumber } from "@/lib/utils";

interface CardProps {
  title: string;
  stat: number;
  goal: number;
  icon: React.ReactNode;
  color?: string;
}

const Card = ({ title, stat, icon, color, goal }: CardProps) => {
  const { t } = useTranslation();
  const isOver = stat > goal;
  const isFull = stat - goal > 0 && stat - goal <= 15;

  return (
    <div
      className={cn(
        "border rounded-md flex flex-col gap-2.5 w-full py-2 bg-card",
        isOver && "bg-red-950",
        isFull && "bg-green-950",
      )}
    >
      <div className="ml-3">
        <p className="text-2xl max-sm:text-xl font-bold">
          {isOver ? stat.toFixed() : getDisplayStat(stat, goal)}
          {t("g")}
        </p>{" "}
        <span className="text-sm">{title}</span>
      </div>
      <CircularProgress
        value={isOver ? 100 : roundNumber(stat, goal)}
        size="sm"
        icon={icon}
        className=""
        color={color}
      />
    </div>
  );
};

export default Card;

import { cn } from "@/lib/utils";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

interface MacroCardProps {
  goal: number;
  title: string;
  stat: number;
  icon: JSX.Element;
  color: "red" | "yellow" | "blue";
}

export function MacroCard({
  goal,
  title,
  stat,
  icon: Icon,
  color,
}: MacroCardProps) {
  const percentage = Number(((stat / goal) * 100).toFixed(1));
  const isSuccess = percentage >= 100 && percentage <= 110;
  const isOver = percentage > 110;

  const colorMap = {
    red: {
      bg: "bg-[#2d1b1b]",
      border: "border-[#5e3030]",
      text: "text-[#ff7a7a]",
      progress: "bg-[#ff7a7a]",
      iconBg: "bg-[#4d2a2a]",
      shadow: "shadow-[0_0_10px_rgba(255,122,122,0.3)]",
    },
    yellow: {
      bg: "bg-[#2d2a1b]",
      border: "border-[#5e5430]",
      text: "text-[#ffde7a]",
      progress: "bg-[#ffde7a]",
      iconBg: "bg-[#4d462a]",
      shadow: "shadow-[0_0_10px_rgba(255,222,122,0.3)]",
    },
    blue: {
      bg: "bg-[#1b212d]",
      border: "border-[#303d5e]",
      text: "text-[#7abaff]",
      progress: "bg-[#7abaff]",
      iconBg: "bg-[#2a344d]",
      shadow: "shadow-[0_0_10px_rgba(122,186,255,0.3)]",
    },
    success: {
      bg: "bg-[#1b2d1b]",
      border: "border-[#30d55e]",
      text: "text-[#7aff8a]",
      progress: "bg-[#30d55e]",
      iconBg: "bg-[#1a4d26]",
      shadow: "shadow-[0_0_15px_rgba(48,213,94,0.6)]",
      cardGlow: "shadow-[0_0_20px_rgba(48,213,94,0.3)]",
    },
    over: {
      bg: "bg-[#2d1b1b]",
      border: "border-[#d53030]",
      text: "text-[#ff7a7a]",
      progress: "bg-[#d53030]",
      iconBg: "bg-[#4d1a1a]",
      shadow: "shadow-[0_0_15px_rgba(213,48,48,0.6)]",
      cardGlow: "shadow-[0_0_20px_rgba(213,48,48,0.3)]",
    },
  };

  const { t } = useTranslation();

  const theme = isSuccess
    ? colorMap.success
    : isOver
      ? colorMap.over
      : colorMap[color];

  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 p-3 rounded-2xl border transition-all duration-500 min-w-[100px]",
        theme.bg,
        theme.border,
        isSuccess && colorMap.success.cardGlow,
      )}
    >
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-white tracking-tight">
          {goal}
          {t("g")}
        </h3>
        <p className="text-[#a1a1aa] text-lg font-medium tracking-wide">
          {title}
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative flex items-center h-9">
          {/* Progress Bar Track */}
          <div className="absolute inset-0 bg-black/40 rounded-full border border-white/5" />

          {/* Progress Fill */}
          <div
            className={cn(
              "absolute inset-0 rounded-full transition-all duration-1000 ease-out",
              theme.progress,
              theme.shadow,
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />

          {/* Icon Circle */}
          <div
            className={cn(
              "relative z-10 flex items-center justify-center w-9 h-9 rounded-full border-2 transition-colors duration-500",
              theme.iconBg,
              theme.border,
            )}
          >
            {Icon}
          </div>
        </div>

        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-wider transition-colors duration-500",
            theme.text,
          )}
        >
          {percentage}% {t("of_goal")}
        </p>
      </div>
    </div>
  );
}

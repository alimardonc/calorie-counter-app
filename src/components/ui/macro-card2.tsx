import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MacroCardProps {
  amount: string;
  label: string;
  percentage: number;
  icon: LucideIcon;
  color: "red" | "yellow" | "blue";
}

export function MacroCard2({
  amount,
  label,
  percentage,
  icon: Icon,
  color,
}: MacroCardProps) {
  const isSuccess = percentage >= 100 && percentage <= 110;
  const isOver = percentage > 110;

  const colorMap = {
    red: {
      bg: "bg-[#1a0f0f]",
      border: "border-[#3d1a1a]",
      text: "text-red-400",
      progress: "bg-red-500",
      iconBg: "bg-[#2d1414]",
      shadow: "shadow-[0_0_12px_rgba(239,68,68,0.3)]",
    },
    yellow: {
      bg: "bg-[#1a160f]",
      border: "border-[#3d2f1a]",
      text: "text-amber-400",
      progress: "bg-amber-500",
      iconBg: "bg-[#2d2214]",
      shadow: "shadow-[0_0_12px_rgba(245,158,11,0.3)]",
    },
    blue: {
      bg: "bg-[#0f141a]",
      border: "border-[#1a2b3d]",
      text: "text-blue-400",
      progress: "bg-blue-500",
      iconBg: "bg-[#14202d]",
      shadow: "shadow-[0_0_12px_rgba(59,130,246,0.3)]",
    },
    success: {
      bg: "bg-[#0f1a0f]",
      border: "border-[#1a3d1a]",
      text: "text-emerald-400",
      progress: "bg-emerald-500",
      iconBg: "bg-[#142d14]",
      shadow: "shadow-[0_0_15px_rgba(16,185,129,0.5)]",
    },
    over: {
      bg: "bg-[#1a0f0f]",
      border: "border-red-900/50",
      text: "text-red-500",
      progress: "bg-red-600",
      iconBg: "bg-[#2d1414]",
      shadow: "shadow-[0_0_15px_rgba(220,38,38,0.5)]",
    },
  };

  const theme = isSuccess
    ? colorMap.success
    : isOver
      ? colorMap.over
      : colorMap[color];

  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 p-3 rounded-xl border transition-all duration-500 min-w-[100px] w-full",
        theme.bg,
        theme.border,
        isSuccess &&
          "ring-1 ring-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]",
      )}
    >
      <div className="space-y-0">
        <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight tabular-nums truncate">
          {amount}
        </h3>
        <p className="text-zinc-500 text-[10px] sm:text-sm font-medium uppercase tracking-wider">
          {label}
        </p>
      </div>

      <div className="space-y-2">
        <div className="relative flex items-center h-7 sm:h-9">
          {/* Progress Bar Track */}
          <div className="absolute inset-0 bg-black/60 rounded-full border border-white/5" />

          {/* Progress Fill */}
          <div
            className={cn(
              "absolute left-0 top-0 bottom-0 rounded-full transition-all duration-1000 ease-out",
              theme.progress,
              theme.shadow,
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />

          {/* Icon Circle */}
          <div
            className={cn(
              "relative z-10 flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-white/10 shrink-0",
              theme.iconBg,
            )}
          >
            <Icon className={cn("w-3 h-3 sm:w-4 sm:h-4", theme.text)} />
          </div>
        </div>

        <p
          className={cn(
            "text-[9px] sm:text-xs font-bold uppercase tracking-widest",
            theme.text,
          )}
        >
          {percentage}%
          <span className="hidden xs:inline ml-1 opacity-60">Goal</span>
        </p>
      </div>
    </div>
  );
}

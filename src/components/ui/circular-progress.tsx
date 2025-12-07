import type React from "react";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  size?: "sm" | "md" | "lg";
  strokeWidth?: number;
  icon?: React.ReactNode;
  label?: string;
  className?: string;
  color?: string;
}

const sizeMap = {
  sm: { size: 60, radius: 25 },
  md: { size: 90, radius: 40 },
  lg: { size: 160, radius: 64 },
};

export function CircularProgress({
  value,
  size = "md",
  strokeWidth = 4,
  icon,
  label,
  className,
  color,
}: CircularProgressProps) {
  const dimensions = sizeMap[size];
  const { size: svgSize, radius } = dimensions;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted"
          />

          {/* Progress circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary transition-all duration-500 ease-out"
            style={{ color: color }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute flex flex-col items-center justify-center gap-1">
          {icon && <div className="text-primary">{icon}</div>}
          {/*<span className="text-sm font-semibold text-foreground">
            {value}%
          </span>*/}
        </div>
      </div>

      {label && (
        <p className="text-sm text-muted-foreground text-center">{label}</p>
      )}
    </div>
  );
}

"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Flame, Beef, Activity, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface AnalysisStep {
  label: string;
  icon: React.ReactNode;
}

export function AnalysisLoader() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { t } = useTranslation();

  const analysisSteps: AnalysisStep[] = [
    { label: t("loader.title1"), icon: <Flame className="h-5 w-5" /> },
    { label: t("loader.title2"), icon: <Beef className="h-5 w-5" /> },
    {
      label: t("loader.title3"),
      icon: <Activity className="h-5 w-5" />,
    },
    { label: t("loader.title4"), icon: <CheckCircle2 className="h-5 w-5" /> },
  ];

  const isComplete = currentStep === analysisSteps.length - 1;

  useEffect(() => {
    if (currentStep >= analysisSteps.length - 1) return;

    const timer = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, currentStep]);
      setCurrentStep((prev) => prev + 1);
    }, 1250);

    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-md overflow-hidden border-0 shadow-2xl bg-linear-to-br from-card to-secondary/30">
        <div className="p-8">
          <div className="mb-6 space-y-2">
            <h3 className="text-2xl font-bold text-center">
              {Math.round(((currentStep + 1) / analysisSteps.length) * 100)}%
            </h3>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isComplete
                    ? "bg-emerald-500"
                    : "bg-linear-to-r from-primary to-primary/70"
                }`}
                style={{
                  width: `${((currentStep + 1) / analysisSteps.length) * 100}%`,
                }}
              />
            </div>
          </div>
          <div className="space-y-3">
            {analysisSteps.map((step, index) => {
              const isActive = index === currentStep;
              const isDone =
                completedSteps.includes(index) ||
                (isComplete && index === analysisSteps.length - 1);
              const isPending = index > currentStep;

              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-all duration-500",
                    isActive && "bg-primary/10 border border-primary/20",
                    isDone && "bg-emerald-500/10 border border-emerald-500/20",
                    isPending && "bg-muted/30 border border-transparent",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center h-10 w-10 rounded-full transition-all duration-500",
                      isActive && "bg-primary text-primary-foreground",
                      isDone && "bg-emerald-500 text-white",
                      isPending && "bg-muted text-muted-foreground",
                    )}
                  >
                    {isDone && !isActive ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <div className={isActive ? "animate-pulse" : ""}>
                        {step.icon}
                      </div>
                    )}
                  </div>

                  <span
                    className={cn(
                      "flex-1 text-sm font-medium transition-colors duration-300",
                      isActive && "text-foreground",
                      isDone && "text-emerald-600 dark:text-emerald-400",
                      isPending && "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </span>

                  {isActive && !isComplete && (
                    <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  )}
                  {isDone && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 animate-in zoom-in duration-300" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { FaFire } from "react-icons/fa6";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import Analyzing from "../analyzing";
import { getSteps } from "./steps";
import type { IUserInfo } from "@/types";
import { useTranslation } from "react-i18next";
import type { ISelected, IStepBase } from "./types";
import LanguageSelect from "../lang-select";
import { Slider } from "../ui/slider";

const ProfileStepper = () => {
  const [step, setStep] = useState(0);
  const [welcome, setWelcome] = useState(true);
  const [selected, setSelected] = useState<ISelected>({ weeklykg: 0.8 });
  const { t } = useTranslation();
  const steps = getSteps();

  useEffect(() => {
    if (selected?.goal == "Maintenance") {
      setSelected((prev) => ({ ...prev, ["weightgoal"]: prev.weight }));
    } else {
      setSelected((prev) => ({ ...prev, ["weightgoal"]: 0 }));
    }
  }, [selected.goal]);

  if (step === steps.length) {
    const userinfo = selected as IUserInfo;
    return <Analyzing userinfo={userinfo} api_key={selected.api_key + ""} />;
  }

  if (welcome) {
    const title = t("steps.title").split(" ");
    return (
      <>
        <div className="flex w-full justify-end">
          <LanguageSelect />
        </div>
        <div className="w-full h-[calc(100%-36px)] flex flex-col justify-end">
          <div className="flex flex-col gap-4 items-center justify-center mb-40">
            <FaFire size={70} />
            <p className="font-bold text-xl">Lumaro</p>
          </div>
          <div className="flex flex-col items-center text-center justify-end gap-6 pb-10">
            <h3 className="text-2xl font-bold">
              {title[0] + " " + title[1]}
              <br />
              {title[2] + " " + title[3]}
            </h3>
            <Button
              className="rounded-full w-full"
              onClick={() => setWelcome(false)}
            >
              {t("steps.get_started")}
            </Button>
          </div>
        </div>
      </>
    );
  }

  const currentStep = steps[step] as IStepBase<keyof ISelected>;

  const next = () => setStep((s) => Math.min(s + 1, steps.length));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSelect = <K extends keyof ISelected>(
    id: K,
    value: ISelected[K],
  ) => {
    setSelected((prev) => ({ ...prev, [id]: value }));
  };

  const handleInput = <K extends keyof ISelected>(
    id: K,
    value: string | number,
  ) => {
    setSelected((prev) => ({
      ...prev,
      [id]:
        typeof prev[id] === "number" ||
        id === "weight" ||
        id === "height" ||
        id === "age" ||
        id === "weightgoal"
          ? Number(value)
          : value,
    }));
  };

  const isMaintenance = selected["goal"] == "Maintenance";
  const isNextDisabled =
    selected[currentStep.id] === undefined || selected[currentStep.id] === "";

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2">
          <Button
            className="rounded-full size-10 p-0"
            onClick={prev}
            disabled={step === 0}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <Progress value={(step / steps.length) * 100} />
        </div>
        <h2 className="mt-5 text-2xl font-bold">
          {currentStep.id !== "weeklykg"
            ? currentStep.title
            : currentStep.title +
              " " +
              (selected["goal"] == "Muscle Gain"
                ? t("steps.weeklykg.gain")
                : t("steps.weeklykg.loss")) +
              " " +
              t("steps.weeklykg.title2")}
        </h2>
        {currentStep.id == "api_key" && (
          <p>
            {t("steps.api_key.description")}{" "}
            <a
              href="https://aistudio.google.com/api-keys"
              target="_blank"
              className="text-blue-500"
            >
              aistudio
            </a>
          </p>
        )}
      </div>
      {currentStep.type === "input" ? (
        <div>
          <label className="font-bold">{currentStep.label}</label>
          <Input
            className="h-10 text-[16px] mt-2"
            type={currentStep.inputtype ? "text" : "number"}
            placeholder={currentStep.label}
            value={selected[currentStep.id] || ""}
            onChange={(e) => handleInput(currentStep.id, e.target.value)}
          />
        </div>
      ) : currentStep.type == "slider" && !isMaintenance ? (
        <div className="flex flex-col gap-5 text-center">
          <p className="font-bold text-2xl">
            {selected[currentStep.id]} {t("kg")}
          </p>
          <Slider
            defaultValue={[selected.weeklykg ?? 0.8]}
            min={0.5}
            step={0.1}
            max={1.5}
            onValueChange={(e) => handleInput(currentStep.id, e[0])}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {currentStep.content?.map((option) => {
            const titles = (currentStep?.contentTitles ?? {}) as Record<
              string,
              string
            >;
            const title = titles[option.label ?? ""];
            return (
              <Button
                key={option.value}
                className={cn(
                  "h-14 text-[16px] justify-start",
                  title && "flex-col justify-center items-start gap-0",
                )}
                variant={
                  selected[currentStep.id] === option.value
                    ? "secondary"
                    : "default"
                }
                disabled={selected[currentStep.id] === option.value}
                onClick={() => handleSelect(currentStep.id, option.value)}
              >
                {option.label}
                {title && <p className="text-xs">{title}</p>}
              </Button>
            );
          })}
        </div>
      )}

      <Button onClick={next} disabled={isNextDisabled} className="w-full h-11">
        {step === steps.length - 1 ? t("steps.analyze") : t("steps.continue")}
      </Button>
    </div>
  );
};

export default ProfileStepper;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCalendarStore } from "@/store/use-calendar";
import { useStore } from "@/store/use-store";
import { Button } from "../components/ui/button";
import { ArrowLeft, Bot, Trash } from "lucide-react";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { Spinner } from "@/components/ui/spinner";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Card2 from "@/components/ui/card2";
import {
  CalorieIcon,
  ProteinIcon,
  CarbIcon,
  FatIcon,
  caloriesColor,
  proteinColor,
  carbsColor,
  fatColor,
} from "@/components/constants/food";
import { IoSparklesSharp } from "react-icons/io5";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaHeartBroken } from "react-icons/fa";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";

const FoodPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const selectedDate = useCalendarStore((state) => state.selectedDate);
  const foodsState = useStore((state) => state.foodStats);
  const deleteFood = useStore((state) => state.deleteFood);
  const retry = useStore((state) => state.retryAnalyzeFood);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const foods = selectedDate ? foodsState[selectedDate] : undefined;
  const food = foods?.find((e) => e.id === id);

  if (!hydrated || !selectedDate || !foods) {
    return (
      <div className="w-full h-full flex justify-center items-center flex-col gap-5">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!food) {
    return (
      <div className="w-full h-full flex justify-center items-center flex-col gap-5">
        <Button onClick={() => navigate("/")}>Go to Home</Button>
      </div>
    );
  }

  return (
    <div className="relative bg-background flex flex-col h-dvh">
      <div className="absolute top-2.5 px-2.5 w-full flex justify-between items-center">
        <Button
          className="rounded-full size-12.5"
          size="icon"
          variant="secondary"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="size-7! text-primary" />
        </Button>

        <Drawer>
          <DrawerTrigger asChild>
            <button className="bg-card cursor-pointer size-12.5 rounded-full flex items-center justify-center">
              <HiDotsHorizontal className="size-7! text-primary" />
            </button>
          </DrawerTrigger>
          <DrawerDescription className="sr-only"></DrawerDescription>
          <DrawerContent className="px-4 pb-2">
            <DrawerHeader>
              <DrawerTitle>{food.foodName}</DrawerTitle>
            </DrawerHeader>
            <Button
              variant="destructive"
              onClick={() => {
                deleteFood(food.id);
                navigate("/");
              }}
            >
              <Trash />
              {t("delete")}
            </Button>
          </DrawerContent>
        </Drawer>
      </div>

      <img
        src={food.image}
        alt={food.foodName}
        className="w-full max-h-64 object-cover"
      />

      <div className="p-4">
        <div className="flex gap-3 items-center justify-between mb-2">
          <div className="flex gap-3 items-center">
            <button>
              {food.isFavorite ? (
                <IoBookmark strokeWidth={2} className="size-5!" />
              ) : (
                <IoBookmarkOutline strokeWidth={2} className="size-5!" />
              )}
            </button>
            <p className="font-bold text-sm bg-accent py-1.5 px-3 rounded-[6px] text-muted-foreground">
              {food.weight + " " + food.servingUnit}
            </p>
          </div>
          <p className="font-bold text-sm bg-accent py-1.5 px-3 rounded-[6px] text-muted-foreground">
            {new Date(food.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </p>
        </div>
        <h2 className="text-3xl font-bold">{food.foodName}</h2>
      </div>

      <div className="px-4 flex-1 min-h-0 flex flex-col gap-3 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          <Card2
            stat={food.calories}
            Icon={CalorieIcon}
            title={t("nutfact.calories")}
            color={caloriesColor}
          />
          <Card2
            stat={food.protein}
            Icon={ProteinIcon}
            title={t("nutfact.protein")}
            color={proteinColor}
          />
          <Card2
            stat={food.carbs}
            Icon={CarbIcon}
            title={t("nutfact.carbs")}
            color={carbsColor}
          />
          <Card2
            stat={food.fat}
            Icon={FatIcon}
            title={t("nutfact.fat")}
            color={fatColor}
          />
        </div>

        {food?.healthScore && (
          <div className="bg-card w-full flex rounded-md px-4 py-3 items-start justify-between">
            <div className="flex gap-3 h-full items-start">
              <FaHeartBroken color="#ff2525" size={30} className="mt-1" />
              <div className="flex flex-col gap-3">
                <p className="text-xl font-bold">{t("health_score")}</p>
                <Progress
                  value={food.healthScore * 10}
                  className="[&>div]:bg-green-400 w-45"
                />
              </div>
            </div>
            <p className="font-bold">{food.healthScore}/10</p>
          </div>
        )}

        {food?.confidence && (
          <div className="bg-card w-full flex rounded-md px-4 py-3 items-start justify-between">
            <div className="flex gap-3 h-full items-start">
              <Bot color="#0089ff" size={30} className="mt-1" strokeWidth={2} />
              <div className="flex flex-col gap-3">
                <p className="text-xl font-bold">{t("food_page.confidence")}</p>
                <Progress
                  value={food.confidence * 10}
                  className="[&>div]:bg-yellow-400 w-45"
                />
              </div>
            </div>
            <p className="font-bold">{food.confidence}/10</p>
          </div>
        )}

        {food?.ingredients && (
          <>
            <h2 className="text-3xl font-bold">{t("food_page.ingredients")}</h2>
            <div className="grid grid-cols-1 gap-2">
              {food.ingredients.map((e, idx) => (
                <div
                  key={idx}
                  className="bg-card w-full flex rounded-md px-4 py-2 items-center gap-3"
                >
                  <p className="text-sm">{e}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Кнопки */}
      <div className="grid grid-cols-2 gap-2 py-3 px-4">
        <Button
          className="h-11 rounded-full"
          variant="outline"
          onClick={() => retry(food.id, "")}
        >
          <IoSparklesSharp />
          {t("fix_results")}
        </Button>
        <Button className="h-11 rounded-full" onClick={() => navigate("/")}>
          {t("done")}
        </Button>
      </div>
    </div>
  );
};

export default FoodPage;

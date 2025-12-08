import type { IFood } from "@/types";
import { Button } from "./button";
import { IoReload } from "react-icons/io5";
import { useStore } from "@/store/use-store";

export default function FoodRetry({ food }: { food: IFood }) {
  const retry = useStore((state) => state.retryAnalyzeFood);

  return (
    <div className="relative w-full h-full">
      <div className="w-full h-full absolute backdrop-blur-xs bg-red-900/30 z-50 flex items-center justify-center">
        <Button
          className="size-12 rounded-full"
          variant="destructive"
          onClick={() => retry(food.id, "")}
        >
          <IoReload />
        </Button>
      </div>
      <div className="bg-card w-full h-28 flex rounded-xl overflow-hidden shadow-sm border border-border/50">
        <img
          src={food.image}
          alt={food.foodName}
          className="w-30 h-full object-cover rounded-[6px]"
        />
        <div className="flex flex-col gap-2.5 px-4 py-2.5 flex-1">
          <div className="flex justify-between w-full">
            <div className="w-24 h-4 bg-linear-to-r bg-red-900 rounded-[6px] overflow-hidden relative"></div>
            <p className="font-bold text-sm text-muted-foreground">
              {new Date(food.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </p>
          </div>
          <div className="w-24 h-5 bg-linear-to-r bg-red-900 rounded-[6px] overflow-hidden relative"></div>
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-full h-4 bg-linear-to-r bg-red-900 rounded-[6px] overflow-hidden relative"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

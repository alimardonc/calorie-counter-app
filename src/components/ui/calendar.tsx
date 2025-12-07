import dayjs from "dayjs";
import "dayjs/locale/ru";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useCalendarStore } from "@/store/use-calendar";
import "@/lib/dayjs-uz";
import "dayjs/locale/ru";
import "dayjs/locale/en";
import i18n from "@/i18n";
import { useStore } from "@/store/use-store";
import { cn } from "@/lib/utils";
import { BsEmojiExpressionlessFill } from "react-icons/bs";

export function WeekCalendar() {
  const { selectedDate, startOfWeek, setSelectedDate, nextWeek, prevWeek } =
    useCalendarStore();
  const foods = useStore((state) => state.foodStats);
  const nutFact = useStore((state) => state.nutFact);

  dayjs.locale(i18n.language);

  const start = dayjs(startOfWeek);
  const selected = dayjs(selectedDate);

  const days = Array.from({ length: 7 }).map((_, i) => start.add(i, "day"));

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center justify-between w-full">
        <Button variant="ghost" size="icon" onClick={prevWeek}>
          <ArrowLeftIcon />
        </Button>
        <div className="font-semibold">
          {start.format("D MMM")} – {start.add(6, "day").format("D MMM")}
        </div>
        <Button variant="ghost" size="icon" onClick={nextWeek}>
          <ArrowRightIcon />
        </Button>
      </div>

      <div className="flex justify-between w-full mt-2">
        {days.map((day) => {
          const isSelected = day.isSame(selected, "day");
          const calories = foods[day.toDate().toDateString()]?.reduce(
            (sum, item) => sum + item.calories,
            0,
          );
          const isOver = calories > nutFact.calories;
          const isFull =
            calories - nutFact.calories > 0 &&
            calories - nutFact.calories <= 100;

          return (
            <Button
              key={day.toString()}
              onClick={() => setSelectedDate(day.toDate().toDateString())}
              variant={isSelected ? "default" : "ghost"}
              className={cn(
                "flex-col h-max border border-transparent",
                isOver && "border border-red-800 text-red-500",
                isFull && "border border-green-800 text-green-500",
              )}
            >
              <span className="text-xs">{day.format("dd")}</span>
              {isOver ? (
                <BsEmojiExpressionlessFill />
              ) : (
                <span className="font-medium">{day.format("D")}</span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

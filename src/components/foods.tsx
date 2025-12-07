import { useCalendarStore } from "@/store/use-calendar";
import { useStore } from "@/store/use-store";
import FoodSkeleton from "./ui/food-skeleton";
import FoodItem from "./ui/food-item";
import { NavLink } from "react-router-dom";

const Foods = () => {
  const selectedDate = useCalendarStore((state) => state.selectedDate);
  const foods = useStore((state) => state.foodStats[selectedDate]);
  const sortedFoods = foods
    ? [...foods].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    : [];

  const isAnalyzing = useStore((state) => state.isAnalyzing);

  return (
    <div className="flex flex-col my-4 gap-2.5 overflow-auto">
      {isAnalyzing && <FoodSkeleton />}
      {sortedFoods?.map((food) => (
        <NavLink key={food.id} to={"/food/" + food.id}>
          <FoodItem food={food} />
        </NavLink>
      ))}
    </div>
  );
};

export default Foods;

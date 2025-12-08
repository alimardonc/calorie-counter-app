import { useCalendarStore } from "@/store/use-calendar";
import { useStore } from "@/store/use-store";
import FoodSkeleton from "./ui/food-skeleton";
import FoodItem from "./ui/food-item";
import { NavLink } from "react-router-dom";
import FoodRetry from "./ui/food-retry";

const Foods = () => {
  const selectedDate = useCalendarStore((state) => state.selectedDate);
  const foods = useStore((state) => state.foodStats[selectedDate]);
  const sortedFoods = foods
    ? [...foods].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    : [];

  return (
    <div className="grid grid-cols-1 gap-2.5 mt-2 overflow-y-auto">
      {sortedFoods?.map((food) =>
        food.isLoading ? (
          <FoodSkeleton key={food.id} food={food} />
        ) : food.isRetry ? (
          <FoodRetry key={food.id} food={food} />
        ) : (
          <NavLink key={food.id} to={"/food/" + food.id}>
            <FoodItem food={food} />
          </NavLink>
        ),
      )}
    </div>
  );
};

export default Foods;

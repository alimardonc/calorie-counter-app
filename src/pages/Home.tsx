import { WeekCalendar } from "@/components/ui/calendar";
import Foods from "@/components/foods";
import InformationCards from "@/components/information-cards";

const Home = () => {
  return (
    <div className="flex flex-col h-full gap-4">
      <WeekCalendar />
      <InformationCards />
      <Foods />
    </div>
  );
};

export default Home;

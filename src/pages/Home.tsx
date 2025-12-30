import { WeekCalendar } from "@/components/ui/calendar";
import Foods from "@/components/foods";
import InformationCards from "@/components/information-cards";
// import { Button } from "@/components/ui/button";
// import { IoSparklesSharp } from "react-icons/io5";

const Home = () => {
  return (
    <div className="flex flex-col h-full gap-2">
      <WeekCalendar />
      <InformationCards />
      {/*<div className="flex justify-between items-center">
        <h3 className="font-bold text-xl">Recent Foods</h3>
        <Button variant="outline">
          <IoSparklesSharp /> Analyze day
        </Button>
      </div>*/}
      <Foods />
    </div>
  );
};

export default Home;

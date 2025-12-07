import { WeekCalendar } from "@/components/ui/calendar";
import Foods from "@/components/foods";
import InformationCards from "@/components/information-cards";

const Home = () => {
  return (
    <>
      <WeekCalendar />
      <InformationCards />
      <Foods />
    </>
  );
};

export default Home;

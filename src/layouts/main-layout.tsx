import Navigation from "@/components/navigation";
import { Outlet } from "react-router-dom";

const MainLayout = () => (
  <div className="flex flex-col h-screen w-full p-2 gap-2">
    <div className="flex-1 min-h-0">
      <Outlet />
    </div>
    <Navigation />
  </div>
);

export default MainLayout;

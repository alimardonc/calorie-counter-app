import Navigation from "@/components/navigation";
import { Outlet } from "react-router-dom";

const MainLayout = () => (
  <div className="flex flex-col justify-between h-full w-full p-4">
    {/*<div className="flex-1">*/}
    <Outlet />
    {/*</div>*/}
    <Navigation />
  </div>
);

export default MainLayout;

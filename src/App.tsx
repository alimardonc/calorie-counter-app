import { useEffect, useState } from "react";
import ProfileStepper from "./components/profile-stepper/profile-stepper";
import { Spinner } from "./components/ui/spinner";
import { useStore } from "./store/use-store";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import { useCalendarStore } from "./store/use-calendar";
import FoodPage from "./pages/food";
import MainLayout from "./layouts/main-layout";
import CaptureImage from "./pages/CaptureImage";

const App = () => {
  const user = useStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const resetWeek = useCalendarStore((state) => state.resetWeek);

  useEffect(() => {
    resetWeek();
    setLoading(false);
  }, []);

  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner className="size-20 stroke-1" />
      </div>
    );

  if (!user) {
    return (
      <div className="p-4 h-full w-full">
        <ProfileStepper />
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="/food/:id" element={<FoodPage />} />
      <Route path="/image-capture" element={<CaptureImage />} />
    </Routes>
  );
};

export default App;

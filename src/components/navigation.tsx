import { Home, Plus, Settings } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const Navigation = () => {
  const l = useLocation();
  const { t } = useTranslation();

  const data = [
    {
      id: 1,
      name: t("nav.home"),
      path: "/",
      icon: <Home className="size-7!" />,
    },
    { id: 2, type: "btn", icon: <Plus className="size-7!" /> },
    {
      id: 3,
      name: t("nav.settings"),
      path: "/settings",
      icon: <Settings className="size-7!" />,
    },
  ];

  return (
    <div className="flex justify-between items-center h-[62px] z-100">
      {data.map((e) => (
        <div key={e.id} className="w-full">
          {e.type === "btn" ? (
            <div className="relative size-15 w-full flex justify-center items-center">
              <NavLink to="/image-capture" className="absolute size-18">
                <Button variant="default" className="size-full rounded-full">
                  {e.icon}
                </Button>
              </NavLink>
            </div>
          ) : (
            <Link to={e.path + ""} className="w-full">
              <Button
                variant={l.pathname === e.path ? "secondary" : "ghost"}
                className={cn(
                  "flex flex-col items-center text-muted-foreground w-full h-max [&>svg]:size-6! gap-0.5",
                  l.pathname === e.path ? "text-primary" : "",
                )}
              >
                {e.icon}
                <p className="text-sm">{e.name}</p>
              </Button>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default Navigation;

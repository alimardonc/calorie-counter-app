import LanguageSelect from "@/components/lang-select";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/use-store";
import { Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FaRegUser } from "react-icons/fa";

const liclass = "flex justify-between items-center";

const Settings = () => {
  const nutFact = useStore((state) => state.nutFact);
  const user = useStore((state) => state.user);
  const recalc = useStore((state) => state.recalcCalories);
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">{t("nav.settings")}</h2>
      <div className="bg-accent rounded-md p-2 flex items-center gap-3">
        <div className="size-10 rounded-full bg-card flex items-center justify-center">
          <FaRegUser />
        </div>
        <div>
          <p className="flex items-center gap-2">
            Enter your name <Pencil size={16} />
          </p>
          <p className="text-sm text-muted-foreground">{user?.age} years</p>
        </div>
      </div>
      <ul className="flex flex-col gap-3">
        <li className={liclass}>
          <p>{t("settings.cr_weight")}</p>
          <p className="text-sm">
            {user?.weight} {t("kg")}
          </p>
        </li>
        <li className={liclass}>
          <p>{t("settings.cr_height")}</p>
          <p className="text-sm">
            {user?.height} {t("cm")}
          </p>
        </li>
        <li className={liclass}>
          <p>
            {t("daily")} {t("nutfact.calories").toLowerCase()}
          </p>
          <p className="text-sm">
            {nutFact?.calories} {t("kcal")}
          </p>
        </li>
        <li className={liclass}>
          <p>
            {t("daily")} {t("nutfact.protein").toLowerCase()}
          </p>
          <p className="text-sm">
            {nutFact?.protein} {t("g")}
          </p>
        </li>
        <li className={liclass}>
          <p>
            {t("daily")} {t("nutfact.carbs").toLowerCase()}
          </p>
          <p className="text-sm">
            {nutFact?.carbs} {t("g")}
          </p>
        </li>
        <li className={liclass}>
          <p>
            {t("daily")} {t("nutfact.fat").toLowerCase()}
          </p>
          <p className="text-sm">
            {nutFact?.fat} {t("g")}
          </p>
        </li>
        <li className={liclass}>
          <p>{t("settings.title_weeks_needed")}</p>
          <p className="text-sm">
            {nutFact?.weeksNeeded} {t("settings.weeks")}
          </p>
        </li>
        <li className={liclass}>
          <p>{t("settings.language")}</p>
          <LanguageSelect />
        </li>
        <li className={liclass}>
          <p>{t("settings.recalculate")}</p>
          <Button variant="secondary" onClick={recalc}>
            {t("settings.recalculate")}
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default Settings;

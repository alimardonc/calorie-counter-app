import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { FaRegUser } from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/store/use-store";
import { useTranslation } from "react-i18next";
import LanguageSelect from "@/components/lang-select";
import { Slider } from "@/components/ui/slider";
import { version } from "@/components/constants/version";

type FieldType = "input" | "select" | "slider";
type InputType = "text" | "number";

interface SelectOption {
  value: string;
  label: string;
}

interface FieldConfig {
  label: string;
  type: FieldType;
  inputType?: InputType;
  options?: SelectOption[];
}

interface EditModalState {
  isOpen: boolean;
  field: string;
  value: string;
  type: FieldType;
  title: string;
}

interface SettingsField {
  key: string;
  label: string;
  value: string | number | undefined;
  unit?: string;
  type?: FieldType;
  hidden?: boolean;
  onClick: () => void;
}

const CLICKABLE_ITEM_CLASS =
  "flex justify-between items-center cursor-pointer hover:bg-accent/50 p-2 rounded-md transition-colors";
const STATIC_ITEM_CLASS = "flex justify-between items-center p-2";

const goals = {
  "Weight Loss": "loss",
  "Muscle Gain": "gain",
  Maintenance: "maintenance",
};

const Settings = () => {
  const nutFact = useStore((state) => state.nutFact);
  const user = useStore((state) => state.user);
  const recalc = useStore((state) => state.recalcCalories);
  const updateUser = useStore((state) => state.updateUser);
  const setApiKey = useStore((state) => state.setApiKey);
  const { t } = useTranslation();

  const [editModal, setEditModal] = useState<EditModalState>({
    isOpen: false,
    field: "",
    value: "",
    type: "input",
    title: "",
  });

  const openEditModal = (
    field: string,
    value: string | number | undefined,
    type: FieldType = "input",
    title = "",
  ) => {
    setEditModal({
      isOpen: true,
      field,
      value: value?.toString() || "",
      type,
      title,
    });
  };

  const closeEditModal = () => {
    setEditModal({
      isOpen: false,
      field: "",
      value: "",
      type: "input",
      title: "",
    });
  };

  const handleSave = () => {
    const { field, value } = editModal;

    const numericFields = ["weight", "height", "age", "weightgoal", "weeklykg"];
    const finalValue = numericFields.includes(field) ? Number(value) : value;

    if (field == "apiKey") setApiKey(value);
    else updateUser?.({ [field]: finalValue });
    closeEditModal();
  };

  const getFieldConfig = (field: string): FieldConfig => {
    const configs: Record<string, FieldConfig> = {
      name: {
        label: t("settings.name_input_title"),
        type: "input",
        inputType: "text",
      },
      age: {
        label: t("steps.age.label") || "Age",
        type: "input",
        inputType: "number",
      },
      weight: {
        label: t("settings.cr_weight"),
        type: "input",
        inputType: "number",
      },
      height: {
        label: t("settings.cr_height"),
        type: "input",
        inputType: "number",
      },
      gender: {
        label: t("steps.gender.title"),
        type: "select",
        options: [
          { value: "Male", label: t("steps.gender.male") },
          { value: "Female", label: t("steps.gender.female") },
        ],
      },
      activity: {
        label: t("steps.workouts.title"),
        type: "select",
        options: [
          { value: "0", label: "0" },
          { value: "2 - 3", label: "2 - 3" },
          { value: "4 - 5", label: "4 - 5" },
          { value: "6+", label: "6+" },
        ],
      },
      goal: {
        label: t("steps.goal.title"),
        type: "select",
        options: [
          { value: "Weight Loss", label: t("steps.goal.content.loss") },
          { value: "Muscle Gain", label: t("steps.goal.content.gain") },
          {
            value: "Maintenance",
            label: t("steps.goal.content.maintenance"),
          },
        ],
      },
      weightgoal: {
        label: t("steps.weightgoal.title"),
        type: "input",
        inputType: "number",
      },
      weeklykg: {
        label: t("steps.weeklykg.label"),
        type: "slider",
        inputType: "number",
      },
    };

    return configs[field] || { label: field, type: "input", inputType: "text" };
  };

  const personalInfoFields: SettingsField[] = [
    {
      key: "gender",
      label: t("steps.gender.title"),
      value: t(
        `steps.gender.${user?.gender.toLowerCase() || "male"}` as
          | `steps.gender.male`
          | `steps.gender.female`,
      ),
      type: "select",
      onClick: () => openEditModal("gender", user?.gender, "select"),
    },
    {
      key: "weight",
      label: t("settings.cr_weight"),
      value: user?.weight,
      unit: t("kg"),
      onClick: () => openEditModal("weight", user?.weight),
    },
    {
      key: "height",
      label: t("settings.cr_height"),
      value: user?.height,
      unit: t("cm"),
      onClick: () => openEditModal("height", user?.height),
    },
    {
      key: "age",
      label: t("steps.age.label") || "Age",
      value: user?.age,
      unit: t("settings.years"),
      onClick: () => openEditModal("age", user?.age),
    },
    {
      key: "activity",
      label: t("steps.workouts.title"),
      value: user?.activity,
      type: "select",
      onClick: () => openEditModal("activity", user?.activity, "select"),
    },
  ];

  const goalFields: SettingsField[] = [
    {
      key: "goal",
      label: t("steps.goal.title"),
      value: t(
        `steps.goal.content.${goals[user?.goal || "Maintenance"] || "steps.goal.content.loss"}` as
          | `steps.goal.content.loss`
          | `steps.goal.content.maintenance`
          | `steps.goal.content.gain`,
      ),
      type: "select",
      onClick: () => openEditModal("goal", user?.goal, "select"),
    },
    {
      key: "weightgoal",
      label: t("steps.weightgoal.title"),
      value: user?.weightgoal,
      unit: t("kg"),
      onClick: () => openEditModal("weightgoal", user?.weightgoal),
    },
    user?.goal !== "Maintenance"
      ? {
          key: "weeklyKg",
          label:
            t("steps.weeklykg.title").toLowerCase() +
            " " +
            (user?.goal == "Muscle Gain"
              ? t("steps.weeklykg.gain")
              : t("steps.weeklykg.loss")) +
            " " +
            t("steps.weeklykg.title2"),
          value: user?.weeklykg,
          unit: t("kg"),
          type: "slider",
          onClick: () => openEditModal("weeklykg", nutFact?.weeklyKg || 0.5),
        }
      : {
          key: "weeklyKg",
          label: "",
          value: "",
          unit: t("kg"),
          onClick: () => {},
          hidden: true,
        },
  ];

  const nutritionFields = [
    {
      key: "calories",
      label: `${t("daily")} ${t("nutfact.calories").toLowerCase()}`,
      value: nutFact?.calories,
      unit: t("kcal"),
    },
    {
      key: "protein",
      label: `${t("daily")} ${t("nutfact.protein").toLowerCase()}`,
      value: nutFact?.protein,
      unit: t("g"),
    },
    {
      key: "carbs",
      label: `${t("daily")} ${t("nutfact.carbs").toLowerCase()}`,
      value: nutFact?.carbs,
      unit: t("g"),
    },
    {
      key: "fat",
      label: `${t("daily")} ${t("nutfact.fat").toLowerCase()}`,
      value: nutFact?.fat,
      unit: t("g"),
    },
  ];

  const apiKey: SettingsField = {
    key: "apiKey",
    label: t("steps.api_key.label"),
    value: t("steps.api_key.label"),
    type: "input",
    onClick: () => openEditModal("apiKey", "", "input"),
  };

  const fieldConfig = getFieldConfig(editModal.field);

  const renderEditableField = (field: SettingsField) => {
    if (field.hidden) return null;
    return (
      <li
        key={field.key}
        className={CLICKABLE_ITEM_CLASS}
        onClick={field.onClick}
      >
        <p>{field.label}</p>
        <div className="flex items-center gap-2">
          <p className="text-sm">
            {field.value}
            {field.unit && ` ${field.unit}`}
          </p>
          <Pencil size={14} className="text-muted-foreground" />
        </div>
      </li>
    );
  };

  const renderStaticField = (field: {
    key: string;
    label: string;
    value: string | number | undefined;
    unit?: string;
  }) => (
    <li key={field.key} className={STATIC_ITEM_CLASS}>
      <p>{field.label}</p>
      <p className="text-sm">
        {field.value}
        {field.unit && ` ${field.unit}`}
      </p>
    </li>
  );

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-4 flex-1 h-full overflow-y-auto overflow-x-hidden">
        <h2 className="text-2xl font-bold">{t("nav.settings")}</h2>
        <div
          className="bg-accent rounded-md p-2 flex items-center gap-3 cursor-pointer hover:bg-accent/80 transition-colors"
          onClick={() =>
            openEditModal(
              "name",
              user?.name,
              "input",
              t("settings.name_input_title"),
            )
          }
        >
          <div className="size-10 rounded-full bg-card flex items-center justify-center">
            <FaRegUser />
          </div>
          <div>
            <p className="flex items-center gap-2">
              {user?.name || t("settings.name_input_title")}{" "}
              <Pencil size={16} />
            </p>
            <p className="text-sm text-muted-foreground">
              {user?.age} {t("settings.years")}
            </p>
          </div>
        </div>
        <Accordion type="multiple">
          {/* Personal Information */}
          <AccordionItem value="personal">
            <AccordionTrigger>
              {t("settings.accordion_title1")}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="flex flex-col gap-3">
                {personalInfoFields.map(renderEditableField)}
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Goals & Nutrition */}
          <AccordionItem value="nutrition">
            <AccordionTrigger>
              {t("settings.accordion_title2")}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="flex flex-col gap-3">
                {goalFields.map(renderEditableField)}
                {nutritionFields.map(renderStaticField)}

                {nutFact?.weeksNeeded ? (
                  <li className={STATIC_ITEM_CLASS}>
                    <p>{t("settings.title_weeks_needed")}</p>
                    <p className="text-sm">
                      {nutFact.weeksNeeded} {t("settings.weeks")}
                    </p>
                  </li>
                ) : null}

                <li className={STATIC_ITEM_CLASS}>
                  <p>{t("settings.recalculate")}</p>
                  <Button variant="secondary" onClick={recalc}>
                    {t("settings.recalculate")}
                  </Button>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <ul className="flex flex-col gap-3">
          {renderEditableField(apiKey)}
          <li className={STATIC_ITEM_CLASS}>
            <p>{t("settings.language")}</p>
            <LanguageSelect />
          </li>
        </ul>
        <Dialog open={editModal.isOpen} onOpenChange={closeEditModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("settings.edit")}</DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <Label htmlFor="edit-field">{fieldConfig.label}</Label>
              {fieldConfig.type === "select" && fieldConfig.options && (
                <Select
                  value={editModal.value}
                  onValueChange={(value) =>
                    setEditModal((prev) => ({ ...prev, value }))
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldConfig.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {fieldConfig.type === "slider" && (
                <div className="flex flex-col gap-5 text-center mt-2">
                  <p className="font-bold text-2xl">
                    {editModal.value} {t("kg")}
                  </p>
                  <Slider
                    defaultValue={[Number(editModal?.value)]}
                    min={0.5}
                    step={0.1}
                    max={1.5}
                    onValueChange={(e) =>
                      setEditModal((prev) => ({ ...prev, value: e[0] + "" }))
                    }
                  />
                </div>
              )}
              {fieldConfig.type === "input" && (
                <Input
                  id="edit-field"
                  type={fieldConfig.inputType || "text"}
                  value={editModal.value}
                  onChange={(e) =>
                    setEditModal((prev) => ({ ...prev, value: e.target.value }))
                  }
                  className="mt-2"
                />
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closeEditModal}>
                {t("cancel")}
              </Button>
              <Button onClick={handleSave}>{t("save")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <span className="text-muted-foreground text-sm w-full text-center">
        version {version}
      </span>
    </div>
  );
};

export default Settings;

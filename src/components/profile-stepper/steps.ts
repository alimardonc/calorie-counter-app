import i18n from "@/i18n";

export const getSteps = () => [
  {
    id: "gender",
    title: i18n.t("steps.gender.title"),
    type: "select",
    content: [
      { value: "Male", label: i18n.t("steps.gender.male") },
      { value: "Female", label: i18n.t("steps.gender.female") },
    ],
  },
  {
    id: "activity",
    title: i18n.t("steps.workouts.title"),
    type: "select",
    content: [
      { value: "0", label: "0" },
      { value: "2 - 3", label: "2 - 3" },
      { value: "4 - 5", label: "4 - 5" },
      { value: "6+", label: "6+" },
    ],
    contentTitles: {
      "0": i18n.t("steps.workouts.0"),
      "2 - 3": i18n.t("steps.workouts.2-3"),
      "4 - 5": i18n.t("steps.workouts.4-5"),
      "6+": i18n.t("steps.workouts.6+"),
    },
  },
  {
    id: "height",
    title: i18n.t("steps.height.title"),
    type: "input",
    label: i18n.t("steps.height.label"),
  },
  {
    id: "weight",
    title: i18n.t("steps.weight.title"),
    type: "input",
    label: i18n.t("steps.weight.label"),
  },
  {
    id: "age",
    title: i18n.t("steps.age.title"),
    type: "input",
    label: i18n.t("steps.age.label"),
  },
  {
    id: "goal",
    title: i18n.t("steps.goal.title"),
    type: "select",
    content: [
      { value: "Weight Loss", label: i18n.t("steps.goal.content.loss") },
      { value: "Muscle Gain", label: i18n.t("steps.goal.content.gain") },
      { value: "Maintenance", label: i18n.t("steps.goal.content.maintenance") },
    ],
  },
  {
    id: "weightgoal",
    title: i18n.t("steps.weightgoal.title"),
    type: "input",
    label: i18n.t("steps.weightgoal.label"),
  },
  {
    id: "weeklykg",
    title: i18n.t("steps.weeklykg.title"),
    label: i18n.t("steps.weeklykg.label"),
    type: "slider",
  },
  {
    id: "api_key",
    title: i18n.t("steps.api_key.title"),
    description: i18n.t("steps.api_key.description"),
    type: "input",
    inputtype: "text",
    label: i18n.t("steps.api_key.label"),
  },
];

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

const langs = ["uz 🇺🇿", "en 🇺🇸", "ru 🇷🇺"];

const LanguageSelect = () => {
  const { i18n } = useTranslation();
  console.log(i18n.language);

  return (
    <Select
      defaultValue={i18n.language.trim()}
      onValueChange={(value) => i18n.changeLanguage(value.slice(0, 2))}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent defaultChecked>
        {langs.map((e) => (
          <SelectItem key={e} value={e.slice(0, 2)}>
            {e}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelect;

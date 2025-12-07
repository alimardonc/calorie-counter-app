import type { IconType } from "react-icons/lib";

interface IProps {
  stat: number;
  Icon: IconType;
  title: string;
  color: string;
}

const Card2 = ({ stat, Icon, title, color }: IProps) => {
  return (
    <div className="bg-card w-full flex rounded-md px-4 py-2 items-center gap-3">
      <Icon size={30} color={color} />
      <div>
        <p className="text-sm">{title}</p>
        <span className="text-2xl font-bold">{stat}</span>
      </div>
    </div>
  );
};

export default Card2;

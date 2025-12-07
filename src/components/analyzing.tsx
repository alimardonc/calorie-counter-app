import { useStore } from "@/store/use-store";
import { useEffect } from "react";
import { Spinner } from "./ui/spinner";
import type { IUserInfo } from "@/types";

interface IProps {
  userinfo: IUserInfo;
}

const Analyzing = ({ userinfo }: IProps) => {
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    setTimeout(() => {
      setUser(userinfo);
    }, 1500);
  }, [userinfo]);

  return (
    <div className="w-full h-full flex flex-col gap-1 items-center justify-center">
      <Spinner className="stroke-1 size-15" />
      <p>Analyzing...</p>
    </div>
  );
};

export default Analyzing;

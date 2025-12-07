import { useStore } from "@/store/use-store";
import { useEffect } from "react";
import type { IUserInfo } from "@/types";
import { AnalysisLoader } from "./ui/analysis-loader";

interface IProps {
  userinfo: IUserInfo;
  api_key: string;
}

const Analyzing = ({ userinfo, api_key }: IProps) => {
  const setUser = useStore((state) => state.setUser);
  const setApiKey = useStore((state) => state.setApiKey);

  useEffect(() => {
    setTimeout(() => {
      setUser(userinfo);
      setApiKey(api_key);
    }, 5000);
  }, [userinfo]);

  return <AnalysisLoader />;
};

export default Analyzing;

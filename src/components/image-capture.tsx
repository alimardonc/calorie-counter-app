import { WebCamera, type WebCameraHandler } from "@shivantra/react-web-camera";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { filetoBase64 } from "@/lib/utils";
import ScanCorners from "./ui/scan-corners";
import { useTranslation } from "react-i18next";
import { IoSparklesSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { RefreshCcw, XIcon } from "lucide-react";
import { Input } from "./ui/input";

interface IProps {
  isOpen: boolean;
  handleAnalyze: (image: string, imageType: string, prompt: string) => void;
}

const ImageCapture = ({ isOpen, handleAnalyze }: IProps) => {
  const cameraHandler = useRef<WebCameraHandler>(null);
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");

  async function handleCapture() {
    const file = await cameraHandler.current?.capture();
    if (file) {
      const base64 = await filetoBase64(file);
      setImage(base64);
      setImageFile(file);
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setImage("");
      setImageFile(null);
    }
  }, [isOpen]);

  const clear = () => {
    setImage("");
    setImageFile(null);
  };

  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="h-full">
      <div className="flex flex-col items-center justify-around max-w-full h-full p-0 pb-4">
        <div className="flex pt-4 pr-4 w-full justify-end">
          <Button
            className="rounded-full size-12.5"
            variant="secondary"
            onClick={() => navigate("/")}
          >
            <XIcon className="size-7!" />
          </Button>
        </div>
        {image ? (
          <img
            src={image}
            alt="Captured Image"
            className="w-full h-100 rounded-[6px] object-cover"
          />
        ) : (
          <div className="relative max-h-120 h-full w-full">
            <WebCamera
              style={{ height: "90%", width: "100%" }}
              videoStyle={{ borderRadius: 5 }}
              captureMode="back"
              ref={cameraHandler}
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <ScanCorners />
            </div>
          </div>
        )}
        {image ? (
          <div className="flex flex-col w-full gap-2 px-4">
            <label>{t("image-capture.label")}</label>
            <Input
              placeholder={t("image-capture.placeholder")}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="w-full flex items-center justify-between mt-2">
              <Button onClick={clear} className="h-11" variant="secondary">
                <RefreshCcw />
                {t("image-capture.shoot_again")}
              </Button>
              <Button
                onClick={() => {
                  handleAnalyze(image, imageFile?.type + "", prompt);
                  navigate("/");
                }}
                className="h-11"
              >
                <IoSparklesSharp />
                {t("steps.analyze")}
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleCapture}
            className="size-14 bg-white rounded-full cursor-pointer mb-5"
          ></button>
        )}
      </div>
    </div>
  );
};

export default ImageCapture;

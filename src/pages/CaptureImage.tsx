import ImageCapture from "@/components/image-capture";
import { useStore } from "@/store/use-store";

const CaptureImage = () => {
  const analyzeFood = useStore((state) => state.analyzeFood);

  const handleAnalyze = async (image: string, imageType: string) => {
    analyzeFood(image, imageType);
  };

  return (
    <>
      <ImageCapture
        isOpen={true}
        onOpenChange={() => {}}
        handleAnalyze={handleAnalyze}
      />
    </>
  );
};

export default CaptureImage;

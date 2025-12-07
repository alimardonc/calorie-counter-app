import { Skeleton } from "./skeleton";

const FoodSkeleton = () => {
  return (
    <div className="bg-card w-ful flex">
      <Skeleton className="w-26 h-25" />
      <div className="flex flex-col gap-2.5 px-4 py-2.5 w-[calc(100%-104px)]">
        <div className="flex justify-between w-full">
          <Skeleton className="w-26 h-5" />
          <Skeleton className="w-10 h-5" />
        </div>
        <div className="flex justify-between w-full">
          <Skeleton className="w-30 h-5" />
        </div>
        <div className="flex justify-between w-full">
          <Skeleton className="w-15 h-5" />
          <Skeleton className="w-15 h-5" />
          <Skeleton className="w-15 h-5" />
        </div>
      </div>
    </div>
  );
};

export default FoodSkeleton;

import type { IFood } from "@/types";

export default function FoodSkeleton({ food }: { food: IFood }) {
  return (
    <>
      <style>{`
         @keyframes shimmer {
           0% {
             transform: translateX(-100%);
           }
           100% {
             transform: translateX(100%);
           }
         }
         .animate-shimmer {
           animation: shimmer 2s infinite;
         }
       `}</style>
      <div className="bg-card w-full h-24 flex rounded-xl overflow-hidden shadow-sm border border-border/50">
        <img
          src={food.image}
          alt={food.foodName}
          className="w-30 h-full object-cover rounded-md"
        />
        <div className="flex flex-col gap-2.5 px-4 py-2.5 flex-1">
          <div className="flex justify-between w-full">
            <div className="w-24 h-5 bg-linear-to-r from-muted via-muted/60 to-muted rounded-md overflow-hidden relative">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary/60 to-transparent animate-shimmer" />
            </div>
            <p className="font-bold text-sm text-muted-foreground">
              {new Date(food.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </p>
          </div>
          <div className="flex justify-between w-full">
            <div className="w-32 h-5 bg-linear-to-r from-muted via-muted/60 to-muted rounded-md overflow-hidden relative">
              <div
                className="absolute inset-0 bg-linear-to-r from-transparent via-primary/60 to-transparent animate-shimmer"
                style={{ animationDelay: "0.15s" }}
              />
            </div>
          </div>
          <div className="flex justify-between w-full">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-16 h-5 bg-linear-to-r from-secondary via-secondary/60 to-secondary rounded-full overflow-hidden relative"
              >
                <div
                  className="absolute inset-0 bg-linear-to-r from-transparent via-blue-600/60 to-transparent animate-shimmer"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

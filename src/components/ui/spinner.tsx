import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  "inline-block animate-spin rounded-full border-current border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]",
  {
    variants: {
      size: {
        default: "size-4 border-2",
        sm: "size-6 border-2",
        lg: "size-12 border-3",
        xl: "size-16 border-4",
      },
      variant: {
        default: "text-primary",
        secondary: "text-secondary",
        destructive: "text-destructive",
        muted: "text-muted-foreground",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {
  asChild?: boolean;
}

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, variant, ...props }, ref) => {
    return (
      <span
        className={cn(spinnerVariants({ size, variant }), className)}
        ref={ref}
        role="status"
        aria-label="Loading"
        {...props}
      />
    );
  },
);
Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };

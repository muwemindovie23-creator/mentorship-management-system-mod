import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium tracking-tight transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "rounded-full bg-primary text-primary-foreground shadow-glow-teal hover:bg-teal-deep hover:shadow-glass-lg",
        navy:
          "rounded-full bg-navy text-white shadow-glass hover:bg-navy/90 hover:shadow-glass-lg",
        destructive:
          "rounded-full bg-destructive text-destructive-foreground shadow-glass hover:bg-destructive/90",
        outline:
          "rounded-full border border-border bg-background/60 text-foreground shadow-sm backdrop-blur-sm hover:bg-accent hover:text-accent-foreground hover:border-primary/30",
        secondary:
          "rounded-full bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/70",
        ghost:
          "rounded-full text-foreground hover:bg-accent hover:text-accent-foreground",
        glass:
          "glass rounded-full text-foreground shadow-glass hover:bg-white/80 hover:shadow-glass-lg dark:hover:bg-white/10",
        link: "rounded-none text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 text-sm",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-7 text-base",
        xl: "h-14 px-9 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

import Image from "next/image";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

interface LogoProps {
  variant?: "mark" | "markWhite";
  showWordmark?: boolean;
  size?: number;
  className?: string;
  wordmarkClassName?: string;
}

// Real aspect ratio of the exported Menty mark artwork (w/h).
const ICON_ASPECT = 413 / 352;

/**
 * Menty brand mark — the mentor/mentee arch icon.
 * `variant="mark"` (navy/teal) for light surfaces, `variant="markWhite"`
 * (white/sky) for dark or teal surfaces.
 */
export function Logo({
  variant = "mark",
  showWordmark = true,
  size = 28,
  className,
  wordmarkClassName,
}: LogoProps) {
  const src =
    variant === "markWhite" ? "/images/menty-icon-white.png" : "/images/menty-icon.png";
  const height = size;
  const width = Math.round(size * ICON_ASPECT);

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src={src}
        alt={APP_NAME}
        width={width}
        height={height}
        style={{ width, height }}
        priority
      />
      {showWordmark && (
        <span
          className={cn(
            "font-display font-bold tracking-tight",
            variant === "markWhite" ? "text-white" : "text-navy dark:text-foreground",
            wordmarkClassName
          )}
        >
          {APP_NAME}
        </span>
      )}
    </span>
  );
}


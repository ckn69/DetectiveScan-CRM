import type { ReactNode } from "react";
import { cn } from "./cn";

export type BadgeTone = "neutral" | "red" | "success" | "warning";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-white/8 text-fg-2",
  red: "bg-red-soft text-red-text",
  success: "bg-success/12 text-success",
  warning: "bg-warning/12 text-warning",
};

export function Badge({ tone = "neutral", className, children }: { tone?: BadgeTone; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-[12px] font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

import type { ButtonHTMLAttributes, Ref } from "react";
import { cn } from "./cn";
import { Spinner } from "./spinner";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-sm font-semibold " +
  "transition-[background-color,color,box-shadow,translate] duration-150 ease-out active:translate-y-px " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white " +
  "disabled:pointer-events-none disabled:opacity-45 aria-busy:cursor-progress";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-red text-white hover:bg-red-hover active:bg-red-press",
  secondary: "bg-white/10 text-fg hover:bg-white/16 active:bg-white/22",
  ghost: "bg-transparent text-fg-2 hover:bg-white/8 hover:text-fg active:bg-white/12",
  danger: "bg-transparent text-red-text ring-1 ring-inset ring-red-text/40 hover:bg-red-soft active:bg-red-soft",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px] [&_svg]:size-4",
  md: "h-10 px-4 text-sm [&_svg]:size-[18px]",
  lg: "h-12 px-5 text-[15px] [&_svg]:size-5",
};

/** Classes d'un bouton, pour styler un lien (`<Link>`) comme un bouton. */
export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}): string {
  return cn(base, variants[variant], sizes[size], className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Affiche un indicateur et bloque le bouton pendant une action. */
  loading?: boolean;
  /** Transmis au `<button>` (React 19 : `ref` est une prop comme une autre). */
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

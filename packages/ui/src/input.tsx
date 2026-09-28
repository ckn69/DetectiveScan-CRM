import type { InputHTMLAttributes } from "react";
import { cn } from "./cn";

export const inputClasses =
  "h-11 w-full rounded-sm border border-line-strong bg-surface px-3.5 text-[15px] text-fg " +
  "placeholder:text-fg-3 transition-[border-color,box-shadow] duration-150 ease-out " +
  "hover:border-white/25 focus:border-red focus:outline-none focus:ring-3 focus:ring-red/35 " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "aria-invalid:border-red-text aria-invalid:focus:ring-red-text/30";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Signale une erreur de saisie (bordure rouge + aria-invalid). */
  invalid?: boolean;
}

export function Input({ className, invalid, ...props }: InputProps) {
  return <input className={cn(inputClasses, className)} aria-invalid={invalid || undefined} {...props} />;
}

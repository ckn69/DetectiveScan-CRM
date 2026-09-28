"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "./cn";
import { Input, type InputProps } from "./input";

/** Champ mot de passe avec bouton « afficher / masquer ». */
export function PasswordInput({ className, ...props }: Omit<InputProps, "type">) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input {...props} type={visible ? "text" : "password"} className={cn("pr-12", className)} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-sm text-fg-3 transition-colors duration-150 hover:text-fg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
      >
        {visible ? <EyeOff className="size-[18px]" strokeWidth={1.75} aria-hidden /> : <Eye className="size-[18px]" strokeWidth={1.75} aria-hidden />}
      </button>
    </div>
  );
}

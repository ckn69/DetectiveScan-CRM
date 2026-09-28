import { cn } from "./cn";

/**
 * Marque DetectiveScan — provisoire, en attendant le logo officiel.
 * Loupe dont la lentille contient deux modules de QR code.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("size-8 shrink-0", className)}>
      <rect width="32" height="32" rx="7" fill="#E50914" />
      <circle cx="14" cy="14" r="7.5" fill="none" stroke="#fff" strokeWidth="2.4" />
      <rect x="10.4" y="10.4" width="3.3" height="3.3" rx="0.7" fill="#fff" />
      <rect x="14.3" y="14.3" width="3.3" height="3.3" rx="0.7" fill="#fff" />
      <path d="M19.9 19.9 25 25" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {compact ? (
        <span className="sr-only">DetectiveScan</span>
      ) : (
        <span className="text-[17px] font-bold tracking-[-0.02em] text-fg">DetectiveScan</span>
      )}
    </span>
  );
}

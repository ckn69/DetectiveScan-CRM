/** Plein écran, sans navigation : une tâche sur le terrain, téléphone en main (pose des QR). */
export default function FocusLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-dvh bg-canvas">{children}</div>;
}

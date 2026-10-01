/** Graduations rondes (0, 20, 40…) couvrant `max`, en entiers ; au moins 0 à 4 pour les petites valeurs. */
export function niceScale(max: number): { top: number; ticks: number[] } {
  if (max <= 4) return { top: 4, ticks: [0, 1, 2, 3, 4] };
  const rough = max / 4;
  const power = 10 ** Math.floor(Math.log10(rough));
  const step = Math.max(1, [1, 2, 5, 10].map((m) => m * power).find((s) => s >= rough) ?? 10 * power);
  const top = Math.max(step, Math.ceil(max / step) * step);
  return { top, ticks: Array.from({ length: top / step + 1 }, (_, i) => i * step) };
}

/** Positions étiquetées sur l'axe horizontal, en partant de la plus récente. */
export function xTicks(count: number, granularity: "hour" | "day"): number[] {
  if (granularity === "hour") return [0, 6, 12, 18, 23];
  const step = count <= 8 ? 1 : count <= 16 ? 2 : 7 * Math.ceil(count / 42);
  const ticks: number[] = [];
  for (let index = count - 1; index >= 0; index -= step) ticks.unshift(index);
  return ticks;
}

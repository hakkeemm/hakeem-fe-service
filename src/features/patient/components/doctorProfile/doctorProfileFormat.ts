export function formatCompact(value: number): string {
  if (value >= 1000) {
    const short = value / 1000;
    return `${short % 1 === 0 ? short.toFixed(0) : short.toFixed(1)}k`;
  }
  return value.toString();
}

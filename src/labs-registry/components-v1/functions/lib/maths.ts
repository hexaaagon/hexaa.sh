export function clamp(min: number, input: number, max: number): number {
  return Math.max(min, Math.min(input, max));
}

export function mapRange(
  in_min: number,
  in_max: number,
  input: number,
  out_min: number,
  out_max: number,
): number {
  return ((input - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

export function lerp(x: number, y: number, t: number): number {
  return (1 - t) * x + t * y;
}

export function truncate(value: number, decimals: number): number {
  return parseFloat(value.toFixed(decimals));
}

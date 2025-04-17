export function fmtUsdAmount(num: number): string {
  if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
  } else if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(2).replace(/\.?0+$/, "")}K`;
  } else {
    return `$${num}`;
  }
}

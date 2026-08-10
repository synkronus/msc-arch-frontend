const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function cop(value: number): string {
  return copFormatter.format(value || 0);
}

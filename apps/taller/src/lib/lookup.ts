import type { Customer } from "@smartgarage/contracts";

export const customerName = (customers: readonly Customer[], id: string): string =>
  customers.find((c) => c.id === id)?.nombre ?? "—";

export const vehicleLabel = (
  customers: readonly Customer[],
  customerId: string,
  vehicleId: string,
): string => {
  const c = customers.find((x) => x.id === customerId);
  const v = c?.vehiculos.find((x) => x.id === vehicleId);
  return v ? `${v.marca} ${v.modelo} · ${v.placa}` : "—";
};

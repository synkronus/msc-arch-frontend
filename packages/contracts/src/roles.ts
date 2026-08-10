export type Role =
  | "saas_admin"
  | "owner"
  | "workshop_admin"
  | "technician"
  | "receptionist"
  | "customer";

export type Capability =
  | "clienteApp"
  | "agenda"
  | "receive"
  | "advance"
  | "work"
  | "kpis"
  | "clients";

const SURFACE: Record<Role, readonly Capability[]> = {
  customer:       ["clienteApp"],
  receptionist:   ["agenda", "receive", "clients"],
  technician:     ["agenda", "advance", "work", "clients"],
  workshop_admin: ["agenda", "receive", "advance", "kpis", "clients"],
  owner:          ["agenda", "receive", "advance", "kpis", "clients"],
  saas_admin:     [],
};

export function can(role: Role, capability: Capability): boolean {
  return SURFACE[role].includes(capability);
}

import type { OrderState, CustomerMilestone, Role } from "@smartgarage/contracts";

export const color = {
  ink: "#0F172A",
  amber: "#F59E0B",
  amberD: "#B45309",
  green: "#16A34A",
  red: "#DC2626",
  blue: "#2563EB",
  slate: {
    50: "#F8FAFC", 100: "#F1F5F9", 200: "#E2E8F0", 300: "#CBD5E1",
    400: "#94A3B8", 500: "#64748B", 900: "#0F172A",
  },
} as const;

export const radius = {
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  pill: "9999px",
} as const;

export const STATUS_STYLE: Record<OrderState, { bg: string; fg: string; label: string }> = {
  recibido: { bg: "#E2E8F0", fg: "#334155", label: "Recibido" },
  diagnostico: { bg: "#DBEAFE", fg: "#1D4ED8", label: "Diagnóstico" },
  presupuesto: { bg: "#FEF3C7", fg: "#B45309", label: "Presupuesto" },
  aprobado: { bg: "#E0E7FF", fg: "#4338CA", label: "Aprobado" },
  reparacion: { bg: "#FFEDD5", fg: "#C2410C", label: "En reparación" },
  listo: { bg: "#D1FAE5", fg: "#047857", label: "Listo" },
  entregado: { bg: "#DCFCE7", fg: "#15803D", label: "Entregado" },
};

export const STATUS_BADGE_COLOR: Record<OrderState, string> = {
  recibido: "slate",
  diagnostico: "blue",
  presupuesto: "amber",
  aprobado: "indigo",
  reparacion: "orange",
  listo: "teal",
  entregado: "green",
};

export const STATUS_LABEL: Record<OrderState, string> = Object.fromEntries(
  (Object.keys(STATUS_STYLE) as OrderState[]).map((k) => [k, STATUS_STYLE[k].label]),
) as Record<OrderState, string>;

export const MILESTONE_LABEL: Record<CustomerMilestone, string> = {
  recepcion: "Recepción",
  diagnostico: "Diagnóstico",
  presupuesto: "Presupuesto (aprobación)",
  reparacion: "En reparación",
  entrega: "Entrega",
};

export const ROLE_LABEL: Record<Role, string> = {
  saas_admin: "SaaS Admin",
  owner: "Dueño",
  workshop_admin: "Administrador",
  technician: "Técnico",
  receptionist: "Recepcionista",
  customer: "Cliente",
};

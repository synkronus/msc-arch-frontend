import type { OrderState } from "./order-machine";

export const CUSTOMER_MILESTONES = [
  "recepcion",
  "diagnostico",
  "presupuesto",
  "reparacion",
  "entrega",
] as const;

export type CustomerMilestone = typeof CUSTOMER_MILESTONES[number];

export const toCustomerMilestone: Record<OrderState, CustomerMilestone> = {
  recibido: "recepcion",
  diagnostico: "diagnostico",
  presupuesto: "presupuesto",
  aprobado: "presupuesto",
  reparacion: "reparacion",
  listo: "reparacion",
  entregado: "entrega",
};

import type { ServiceOrder } from "./entities";

export const ORDER_STATES = [
  "recibido",
  "diagnostico",
  "presupuesto",
  "aprobado",
  "reparacion",
  "listo",
  "entregado",
] as const;

export type OrderState = typeof ORDER_STATES[number];

export const NEXT_LABEL: Record<OrderState, string | null> = {
  recibido: "Iniciar diagnóstico",
  diagnostico: "Pasar a presupuesto",
  presupuesto: "Enviar a WhatsApp para aprobación",
  aprobado: "Iniciar reparación",
  reparacion: "Marcar como listo",
  listo: "Entregar vehículo",
  entregado: null,
};

export class IllegalTransitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IllegalTransitionError";
  }
}

export function advance(order: ServiceOrder): ServiceOrder {
  if (order.estado === "entregado") return order;
  if (order.estado === "presupuesto" && order.items.length === 0) {
    throw new IllegalTransitionError("El presupuesto no tiene ítems");
  }
  const i = ORDER_STATES.indexOf(order.estado);
  const next = ORDER_STATES[i + 1]!;
  return next === "entregado"
    ? { ...order, estado: next, entregadoAt: new Date().toISOString() }
    : { ...order, estado: next };
}

export function sendApproval(order: ServiceOrder): ServiceOrder {
  if (order.items.length === 0) {
    throw new IllegalTransitionError("No hay ítems que aprobar");
  }
  const total = order.items.reduce((sum, it) => sum + it.valor, 0);
  return { ...order, estado: "aprobado", total };
}

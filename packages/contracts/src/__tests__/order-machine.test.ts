import { describe, it, expect } from "vitest";
import {
  ORDER_STATES, NEXT_LABEL, advance, sendApproval, IllegalTransitionError,
} from "../order-machine";
import type { ServiceOrder, OrderItem } from "../entities";

describe("order state constants", () => {
  it("exposes 7 canonical states in canonical order", () => {
    expect(ORDER_STATES).toEqual([
      "recibido", "diagnostico", "presupuesto",
      "aprobado", "reparacion", "listo", "entregado",
    ]);
  });

  it("entregado has no next label", () => {
    expect(NEXT_LABEL.entregado).toBeNull();
  });

  it("presupuesto's label routes through WhatsApp", () => {
    expect(NEXT_LABEL.presupuesto).toMatch(/WhatsApp/i);
  });
});

const item = (valor: number, desc = "x", tipo: OrderItem["tipo"] = "repuesto"): OrderItem => ({
  desc, tipo, valor,
});

const order = (estado: ServiceOrder["estado"], items: OrderItem[] = [item(100)]): ServiceOrder => ({
  id: "o", tenantId: "t", customerId: "c", vehicleId: "v",
  motivo: "m", estado, canal: "digital",
  items, total: 0,
  recibidoAt: "2026-01-01T08:00:00.000Z", entregadoAt: null,
});

describe("advance", () => {
  it("moves recibido → diagnostico → presupuesto (when items present) → aprobado", () => {
    expect(advance(order("recibido")).estado).toBe("diagnostico");
    expect(advance(order("diagnostico")).estado).toBe("presupuesto");
    expect(advance(order("presupuesto", [item(200)])).estado).toBe("aprobado");
    expect(advance(order("aprobado")).estado).toBe("reparacion");
    expect(advance(order("reparacion")).estado).toBe("listo");
  });

  it("stamps entregadoAt when entering entregado", () => {
    const out = advance(order("listo"));
    expect(out.estado).toBe("entregado");
    expect(out.entregadoAt).not.toBeNull();
  });

  it("is a NO-OP past entregado (returns the order unchanged, no throw)", () => {
    const delivered = order("entregado");
    delivered.entregadoAt = "2026-01-02T08:00:00.000Z";
    expect(advance(delivered)).toEqual(delivered);
  });

  it("throws when advancing presupuesto with no items", () => {
    expect(() => advance(order("presupuesto", []))).toThrow(IllegalTransitionError);
  });
});

describe("sendApproval", () => {
  it("stamps total and moves presupuesto → aprobado", () => {
    const out = sendApproval(order("presupuesto", [item(200, "Frenos", "mano_de_obra")]));
    expect(out.estado).toBe("aprobado");
    expect(out.total).toBe(200);
  });

  it("throws when items is empty", () => {
    expect(() => sendApproval(order("presupuesto", []))).toThrow(IllegalTransitionError);
  });
});

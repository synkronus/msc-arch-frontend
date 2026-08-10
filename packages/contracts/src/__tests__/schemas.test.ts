import { describe, it, expect, expectTypeOf } from "vitest";
import type { z } from "zod";
import {
  zOrderItem, zServiceOrder, zBooking, zCustomer, zKpis,
} from "../schemas";
import type { ServiceOrder, Booking, Customer, Kpis } from "../entities";

describe("zod schemas", () => {
  it("parses a valid order", () => {
    const r = zServiceOrder.safeParse({
      id: "o", tenantId: "t", customerId: "c", vehicleId: "v",
      motivo: "m", estado: "recibido", canal: "digital",
      items: [], total: 0,
      recibidoAt: "2026-01-01T08:00:00.000Z", entregadoAt: null,
    });
    expect(r.success).toBe(true);
  });

  it("rejects an unknown estado", () => {
    const r = zServiceOrder.safeParse({ estado: "invented" });
    expect(r.success).toBe(false);
  });

  it("rejects a non-positive item value", () => {
    expect(zOrderItem.safeParse({ desc: "x", tipo: "repuesto", valor: -5 }).success).toBe(false);
    expect(zOrderItem.safeParse({ desc: "x", tipo: "repuesto", valor: 0 }).success).toBe(false);
  });

  it("keeps schemas consistent with the declared interfaces", () => {
    expectTypeOf<z.infer<typeof zServiceOrder>>().toMatchTypeOf<ServiceOrder>();
    expectTypeOf<z.infer<typeof zBooking>>().toMatchTypeOf<Booking>();
    expectTypeOf<z.infer<typeof zCustomer>>().toMatchTypeOf<Customer>();
    expectTypeOf<z.infer<typeof zKpis>>().toMatchTypeOf<Kpis>();
  });
});

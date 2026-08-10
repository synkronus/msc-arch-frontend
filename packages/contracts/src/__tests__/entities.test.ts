import { describe, it, expect } from "vitest";
import type { ServiceOrder, NewOrder, NewCustomer } from "../entities";

describe("entity shapes", () => {
  it("constructs a valid ServiceOrder", () => {
    const o: ServiceOrder = {
      id: "o1", tenantId: "t1", customerId: "c1", vehicleId: "v1",
      motivo: "Cambio de aceite", estado: "recibido", canal: "digital",
      items: [], total: 0,
      recibidoAt: "2026-01-01T08:00:00.000Z", entregadoAt: null,
    };
    expect(o.estado).toBe("recibido");
    expect(o.entregadoAt).toBeNull();
  });

  it("NewOrder omits server-set fields", () => {
    const draft: NewOrder = { customerId: "c1", vehicleId: "v1", motivo: "x", canal: "digital" };
    expect(draft.motivo).toBe("x");
  });

  it("NewCustomer is the flat client form (placa, marca, modelo at the top level)", () => {
    const draft: NewCustomer = {
      nombre: "Ana", telefono: "300",
      placa: "ABC123", marca: "Mazda", modelo: "3",
    };
    expect(draft.placa).toBe("ABC123");
  });
});

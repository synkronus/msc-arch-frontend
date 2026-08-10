import { describe, it, expect, vi } from "vitest";
import { MockApiClient } from "../mock-client";
import { seed, type ServiceOrder } from "@smartgarage/contracts";

const fresh = () => new MockApiClient(structuredClone(seed));

describe("MockApiClient", () => {
  it("listOrders returns the seed orders as fresh clones", async () => {
    const api = fresh();
    const orders = await api.listOrders();
    expect(orders).toHaveLength(seed.orders.length);
    expect(orders[0]).not.toBe(seed.orders[0]);
  });

  it("createOrder creates a recibido order and prepends it", async () => {
    const api = fresh();
    const o = await api.createOrder({
      tenantId: "t1", customerId: "c1", vehicleId: "v1",
      motivo: "Frenos", canal: "digital",
    });
    expect(o.estado).toBe("recibido");
    expect(o.total).toBe(0);
    expect(o.entregadoAt).toBeNull();
    expect((await api.listOrders())[0]!.id).toBe(o.id);
  });

  it("advanceOrder moves diagnostico → presupuesto", async () => {
    expect((await fresh().advanceOrder("o5")).estado).toBe("presupuesto");
  });

  it("advanceOrder is a no-op at entregado", async () => {
    expect((await fresh().advanceOrder("o1")).estado).toBe("entregado");
  });

  it("advanceOrder moves presupuesto (with items) → aprobado", async () => {
    expect((await fresh().advanceOrder("o6")).estado).toBe("aprobado");
  });

  it("advanceOrder throws when the order is missing", async () => {
    await expect(fresh().advanceOrder("nope")).rejects.toThrow();
  });

  it("sendApproval stamps total and moves to aprobado", async () => {
    const out = await fresh().sendApproval("o6");
    expect(out.estado).toBe("aprobado");
    expect(out.total).toBe(830000);
  });

  it("sendApproval throws when the order has no items", async () => {
    await expect(fresh().sendApproval("o5")).rejects.toThrow();
  });

  it("addOrderItem appends a valid item and rejects an invalid one", async () => {
    const api = fresh();
    const out = await api.addOrderItem("o5", { desc: "Filtro", tipo: "repuesto", valor: 50000 });
    expect(out.items.some((i) => i.desc === "Filtro")).toBe(true);
    await expect(
      api.addOrderItem("o5", { desc: "X", tipo: "repuesto", valor: 0 }),
    ).rejects.toThrow();
  });

  it("respondRecommendation updates estado and rejects unknown ids", async () => {
    const api = fresh();
    expect((await api.respondRecommendation("r1", "aprobado")).estado).toBe("aprobado");
    await expect(api.respondRecommendation("nope", "aprobado")).rejects.toThrow();
  });

  it("getOrder returns the tracked demo order and a real order", async () => {
    const api = fresh();
    expect((await api.getOrder("o_demo")).id).toBe("o_demo");
    expect((await api.getOrder("o1")).id).toBe("o1");
    await expect(api.getOrder("nope")).rejects.toThrow();
  });

  it("lists catalog, workshops, customers, bookings, recommendations, health", async () => {
    const api = fresh();
    expect((await api.listServiceTypes())).toHaveLength(12);
    expect((await api.listWorkshops())).toHaveLength(3);
    expect((await api.listCustomers())).toHaveLength(6);
    expect((await api.listBookings())).toHaveLength(3);
    expect((await api.listRecommendations("o_demo"))).toHaveLength(2);
    expect((await api.getHealth("o_demo"))).toHaveLength(5);
  });

  it("createBooking adds a programada booking", async () => {
    const api = fresh();
    const b = await api.createBooking({
      tenantId: "t1", customerId: "c1", vehicleId: "v1", servicio: "X",
      fecha: "2026-01-01", hora: "09:00", canal: "digital", recordatorio: true,
    });
    expect(b.estado).toBe("programada");
    expect((await api.listBookings())).toHaveLength(4);
  });

  it("login returns owner or customer by email", async () => {
    const api = fresh();
    expect((await api.login("owner@x.com", "x")).role).toBe("owner");
    expect((await api.login("customer@x.com", "x")).role).toBe("customer");
  });

  it("createCustomer creates a customer with an upper-cased vehicle placa", async () => {
    const c = await fresh().createCustomer({
      tenantId: "t1", nombre: "Eva", telefono: "300",
      placa: "zzz999", marca: "Mazda", modelo: "2",
    });
    expect(c.vehiculos[0]!.placa).toBe("ZZZ999");
  });

  it("subscribeOrder pushes state advances and stops on unsubscribe", () => {
    vi.useFakeTimers();
    const api = fresh();
    const pushes: ServiceOrder[] = [];
    const unsub = api.subscribeOrder("o_demo", (o) => pushes.push(o));
    vi.advanceTimersByTime(5000);
    expect(pushes).toHaveLength(1);
    expect(pushes[0]!.estado).toBe("presupuesto");
    unsub();
    vi.advanceTimersByTime(10_000);
    expect(pushes).toHaveLength(1);
    vi.useRealTimers();
  });

  it("subscribeOrder advances a non-tracked order through to entregado", () => {
    vi.useFakeTimers();
    const api = fresh();
    const pushes: ServiceOrder[] = [];
    api.subscribeOrder("o5", (o) => pushes.push(o));
    vi.advanceTimersByTime(60_000);
    expect(pushes).toHaveLength(5);
    expect(pushes.at(-1)!.estado).toBe("entregado");
    expect(pushes.at(-1)!.entregadoAt).not.toBeNull();
    vi.useRealTimers();
  });

  it("subscribeOrder is a no-op for an unknown id", () => {
    vi.useFakeTimers();
    const api = fresh();
    const pushes: ServiceOrder[] = [];
    api.subscribeOrder("nope", (o) => pushes.push(o));
    vi.advanceTimersByTime(20_000);
    expect(pushes).toHaveLength(0);
    vi.useRealTimers();
  });

  it("createOrder keeps provided items", async () => {
    const o = await fresh().createOrder({
      tenantId: "t1", customerId: "c1", vehicleId: "v1", motivo: "m", canal: "digital",
      items: [{ desc: "Filtro", tipo: "repuesto", valor: 50000 }],
    });
    expect(o.items).toHaveLength(1);
  });

  it("createCustomer carries anio when provided", async () => {
    const c = await fresh().createCustomer({
      tenantId: "t1", nombre: "Eva", telefono: "300",
      placa: "abc", marca: "Mazda", modelo: "2", anio: 2020,
    });
    expect(c.vehiculos[0]!.anio).toBe(2020);
  });
});

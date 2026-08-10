import { describe, it, expect, vi } from "vitest";
import { createAppStore } from "../store";
import { MockApiClient } from "@smartgarage/api-client";
import { seed } from "@smartgarage/contracts";

const fresh = () => createAppStore(new MockApiClient(structuredClone(seed)));

const asOwner = async () => {
  const store = fresh();
  await store.getState().login("owner@x.com", "x");
  return store;
};

describe("store integration (§9.3)", () => {
  it("login sets the session; logout clears it", async () => {
    const store = await asOwner();
    expect(store.getState().session?.role).toBe("owner");
    store.getState().logout();
    expect(store.getState().session).toBeNull();
  });

  it("load actions populate state from the api", async () => {
    const store = await asOwner();
    await store.getState().loadOrders();
    await store.getState().loadCustomers();
    await store.getState().loadBookings();
    await store.getState().loadCatalog();
    await store.getState().loadWorkshops();
    expect(store.getState().orders.length).toBeGreaterThan(0);
    expect(store.getState().customers).toHaveLength(6);
    expect(store.getState().bookings).toHaveLength(3);
    expect(store.getState().catalog).toHaveLength(12);
    expect(store.getState().workshops).toHaveLength(3);
  });

  it("createOrder commits a recibido order at the head of the list", async () => {
    const store = await asOwner();
    const o = await store.getState().createOrder({
      customerId: "c1", vehicleId: "v1", motivo: "Frenos", canal: "digital",
    });
    expect(o.estado).toBe("recibido");
    expect(store.getState().orders[0]!.id).toBe(o.id);
  });

  it("advance moves diagnostico → presupuesto and updates state", async () => {
    const store = await asOwner();
    await store.getState().loadOrders();
    const out = await store.getState().advance("o5");
    expect(out.estado).toBe("presupuesto");
    expect(store.getState().orders.find((o) => o.id === "o5")?.estado).toBe("presupuesto");
  });

  it("advance is a no-op at entregado", async () => {
    const store = await asOwner();
    await store.getState().loadOrders();
    expect((await store.getState().advance("o1")).estado).toBe("entregado");
  });

  it("a receptionist cannot advance (§8.3 role guard)", async () => {
    const store = await asOwner();
    store.getState().setRole("receptionist");
    await store.getState().loadOrders();
    await expect(store.getState().advance("o5")).rejects.toThrow();
  });

  it("advance without a session throws", async () => {
    await expect(fresh().getState().advance("o5")).rejects.toThrow();
  });

  it("sendApproval stamps total and moves to aprobado", async () => {
    const store = await asOwner();
    await store.getState().loadOrders();
    const out = await store.getState().sendApproval("o6");
    expect(out.estado).toBe("aprobado");
    expect(out.total).toBe(830000);
  });

  it("addItem appends an item to the order", async () => {
    const store = await asOwner();
    await store.getState().loadOrders();
    const out = await store.getState().addItem("o5", {
      desc: "Filtro", tipo: "repuesto", valor: 50000,
    });
    expect(out.items.some((i) => i.desc === "Filtro")).toBe(true);
  });

  it("respondRecommendation updates a recommendation after trackOrder", async () => {
    const store = fresh();
    await store.getState().login("customer@x.com", "x");
    await store.getState().trackOrder("o_demo");
    await store.getState().respondRecommendation("r1", "aprobado");
    expect(store.getState().recommendations.find((r) => r.id === "r1")?.estado).toBe("aprobado");
  });

  it("subscribeOrder live-updates trackedOrder", () => {
    vi.useFakeTimers();
    const store = fresh();
    store.getState().subscribeOrder("o_demo");
    vi.advanceTimersByTime(5000);
    expect(store.getState().trackedOrder?.estado).toBe("presupuesto");
    vi.useRealTimers();
  });

  it("createCustomer adds a customer to the list", async () => {
    const store = await asOwner();
    const c = await store.getState().createCustomer({
      nombre: "Eva", telefono: "300", placa: "ZZZ", marca: "Mazda", modelo: "2",
    });
    expect(store.getState().customers.some((x) => x.id === c.id)).toBe(true);
  });

  it("createBooking / createOrder / createCustomer throw without a session", async () => {
    const store = fresh();
    await expect(
      store.getState().createBooking({
        customerId: "c1", vehicleId: "v1", servicio: "X",
        fecha: "2026-01-01", hora: "09:00", canal: "digital", recordatorio: true,
      }),
    ).rejects.toThrow();
    await expect(
      store.getState().createOrder({ customerId: "c1", vehicleId: "v1", motivo: "m", canal: "digital" }),
    ).rejects.toThrow();
    await expect(
      store.getState().createCustomer({ nombre: "E", telefono: "3", placa: "P", marca: "M", modelo: "X" }),
    ).rejects.toThrow();
  });

  it("setRole is a no-op without a session", () => {
    const store = fresh();
    store.getState().setRole("owner");
    expect(store.getState().session).toBeNull();
  });
});

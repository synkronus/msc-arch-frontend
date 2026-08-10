import { describe, it, expect } from "vitest";
import { seed } from "../seed";
import {
  zCustomer, zServiceOrder, zBooking, zServiceType, zWorkshop,
  zRecommendation, zHealthEntry, zSession,
} from "../schemas";

const allValid = <T,>(schema: { safeParse: (x: unknown) => { success: boolean } }, xs: readonly T[]) =>
  xs.every((x) => schema.safeParse(x).success);

describe("seed fixtures (merged MVP data)", () => {
  it("has one tenant", () => {
    expect(seed.tenants).toHaveLength(1);
  });

  it("ships 6 customers from the Taller MVP", () => {
    expect(seed.customers).toHaveLength(6);
    expect(allValid(zCustomer, seed.customers)).toBe(true);
  });

  it("ships 6 orders spanning several states, all valid", () => {
    expect(allValid(zServiceOrder, seed.orders)).toBe(true);
    const states = new Set(seed.orders.map((o) => o.estado));
    expect(states.has("presupuesto")).toBe(true);
    expect(states.has("entregado")).toBe(true);
    expect(states.has("diagnostico")).toBe(true);
  });

  it("ships 3 bookings, all valid", () => {
    expect(seed.bookings).toHaveLength(3);
    expect(allValid(zBooking, seed.bookings)).toBe(true);
  });

  it("ships the Cliente catalog, workshops, recommendations, health", () => {
    expect(allValid(zServiceType, seed.catalog)).toBe(true);
    expect(seed.catalog.length).toBeGreaterThanOrEqual(12);
    expect(allValid(zWorkshop, seed.workshops)).toBe(true);
    expect(allValid(zRecommendation, seed.recommendations)).toBe(true);
    expect(allValid(zHealthEntry, seed.health)).toBe(true);
  });

  it("ships the demo tracked order (Cliente seguimiento)", () => {
    expect(zServiceOrder.safeParse(seed.trackedOrder).success).toBe(true);
    expect(seed.trackedOrder.estado).toBe("diagnostico");
  });

  it("ships an owner and a customer session", () => {
    expect(allValid(zSession, seed.sessions)).toBe(true);
    expect(seed.sessions.some((s) => s.role === "owner")).toBe(true);
    expect(seed.sessions.some((s) => s.role === "customer")).toBe(true);
  });
});

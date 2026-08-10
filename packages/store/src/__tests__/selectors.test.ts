import { describe, it, expect } from "vitest";
import type { StoreState } from "../store";
import {
  selectTenantOrders,
  selectTenantCustomers,
  selectTenantBookings,
  selectKpis,
} from "../selectors";
import { seed } from "@smartgarage/contracts";

const session = (tenantId: string) =>
  ({ userId: "u", tenantId, role: "owner", token: "x" } as StoreState["session"]);

describe("selectors", () => {
  it("filters orders/customers/bookings by the session tenant", () => {
    const s = {
      session: session("t1"),
      orders: [{ id: "a", tenantId: "t1" }, { id: "b", tenantId: "t2" }],
      customers: [{ id: "c1", tenantId: "t1" }, { id: "c2", tenantId: "t2" }],
      bookings: [{ id: "b1", tenantId: "t1" }],
    } as unknown as StoreState;

    expect(selectTenantOrders(s)).toHaveLength(1);
    expect(selectTenantOrders(s)[0]!.id).toBe("a");
    expect(selectTenantCustomers(s)).toHaveLength(1);
    expect(selectTenantBookings(s)).toHaveLength(1);
  });

  it("returns nothing when there is no session", () => {
    const s = { session: null, orders: [{ id: "a", tenantId: "t1" }] } as unknown as StoreState;
    expect(selectTenantOrders(s)).toHaveLength(0);
  });

  it("selectKpis derives the same numbers as computeKpis on the seed", () => {
    const s = { orders: seed.orders, bookings: seed.bookings } as unknown as StoreState;
    const k = selectKpis(s);
    expect(k.entregadas).toBe(4);
    expect(k.ingresos).toBe(1_055_000);
  });
});

import { describe, it, expect } from "vitest";
import { can } from "../roles";

describe("role capabilities (Taller MVP SURFACE)", () => {
  it("a customer can only use the cliente app", () => {
    expect(can("customer", "clienteApp")).toBe(true);
    expect(can("customer", "advance")).toBe(false);
    expect(can("customer", "agenda")).toBe(false);
  });

  it("a receptionist can receive vehicles but cannot advance repairs", () => {
    expect(can("receptionist", "receive")).toBe(true);
    expect(can("receptionist", "advance")).toBe(false);
  });

  it("a technician can advance repairs", () => {
    expect(can("technician", "advance")).toBe(true);
    expect(can("technician", "work")).toBe(true);
  });

  it("both workshop_admin and owner see KPIs", () => {
    expect(can("workshop_admin", "kpis")).toBe(true);
    expect(can("owner", "kpis")).toBe(true);
    expect(can("technician", "kpis")).toBe(false);
  });
});

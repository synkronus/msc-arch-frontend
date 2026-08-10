import { describe, it, expect } from "vitest";
import { computeKpis } from "../kpis";
import { seed } from "../seed";

describe("computeKpis (authentic Taller MVP formulas)", () => {
  it("produces the known numbers for the seed", () => {
    const k = computeKpis(seed.orders, seed.bookings);
    expect(k.entregadas).toBe(4);
    expect(k.tiempoPromedioHoras).toBeCloseTo(11.5, 5);
    expect(k.pctCitasDigitales).toBeCloseTo(66.6667, 3);
    expect(k.tasaRecurrencia).toBeCloseTo(33.3333, 3);
    expect(k.ingresos).toBe(1_055_000);
    expect(k.activas).toBe(2);
  });

  it("returns zeros on empty input without dividing by zero", () => {
    expect(computeKpis([], [])).toEqual({
      tiempoPromedioHoras: 0, pctCitasDigitales: 0, tasaRecurrencia: 0,
      ingresos: 0, activas: 0, entregadas: 0,
    });
  });
});

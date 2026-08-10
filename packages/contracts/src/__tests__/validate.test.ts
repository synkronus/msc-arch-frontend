import { describe, it, expect } from "vitest";
import { isValid, digits, upper } from "../validate";

describe("form predicates (MVP V)", () => {
  it("cotizarStep1 requires placa + marca + anio", () => {
    expect(isValid.cotizarStep1({ placa: "", marca: "X", anio: "2020" })).toBe(false);
    expect(isValid.cotizarStep1({ placa: "ABC", marca: "X", anio: "2020" })).toBe(true);
  });

  it("cotizarStep2 needs at least one selection", () => {
    expect(isValid.cotizarStep2({})).toBe(false);
    expect(isValid.cotizarStep2({ a: true })).toBe(true);
  });

  it("cotizarStep3 requires taller + fecha + hora", () => {
    expect(isValid.cotizarStep3({ taller: "", fecha: "2026-01-01", hora: "09:00" })).toBe(false);
    expect(isValid.cotizarStep3({ taller: "t1", fecha: "2026-01-01", hora: "09:00" })).toBe(true);
  });

  it("newOrder requires cliente + vehiculo + motivo", () => {
    expect(isValid.newOrder({ clienteId: "c1", vehiculoId: "", motivo: "x" })).toBe(false);
    expect(isValid.newOrder({ clienteId: "c1", vehiculoId: "v1", motivo: "x" })).toBe(true);
  });

  it("newCita requires all five booking fields", () => {
    expect(
      isValid.newCita({ clienteId: "c1", vehiculoId: "v1", servicio: "", fecha: "2026-01-01", hora: "09:00" }),
    ).toBe(false);
    expect(
      isValid.newCita({ clienteId: "c1", vehiculoId: "v1", servicio: "s", fecha: "2026-01-01", hora: "09:00" }),
    ).toBe(true);
  });

  it("addItem requires a positive valor", () => {
    expect(isValid.addItem({ desc: "X", valor: "0" })).toBe(false);
    expect(isValid.addItem({ desc: "X", valor: "5000" })).toBe(true);
  });

  it("newClient requires all five fields", () => {
    expect(
      isValid.newClient({ nombre: "A", telefono: "", placa: "P", marca: "M", modelo: "X" }),
    ).toBe(false);
    expect(
      isValid.newClient({ nombre: "A", telefono: "3", placa: "P", marca: "M", modelo: "X" }),
    ).toBe(true);
  });

  it("digits strips non-digits; upper uppercases", () => {
    expect(digits("a1b2c3")).toBe("123");
    expect(upper("abc123")).toBe("ABC123");
  });
});

import { describe, it, expect } from "vitest";
import { cop } from "../format";

describe("cop", () => {
  it("formats COP with no decimals", () => {
    expect(cop(1500)).not.toMatch(/[.,]\d{2}$/);
    expect(cop(1500)).toMatch(/1\.500/);
  });

  it("groups thousands", () => {
    expect(cop(1234567)).toMatch(/1\.234\.567/);
  });

  it("renders 0 for zero", () => {
    expect(cop(0)).toMatch(/0/);
  });
});

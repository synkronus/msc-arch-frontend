import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderApp } from "../test-utils";
import { CotizarView } from "../features/cotizar/CotizarView";

describe("CotizarView", () => {
  it("renders the first step (Tu vehículo)", () => {
    renderApp(<CotizarView flash={() => {}} />);
    expect(screen.getByText("Tu vehículo")).toBeTruthy();
  });

  it("disables Continuar until the vehicle draft is valid", () => {
    renderApp(<CotizarView flash={() => {}} />);
    const next = screen.getByRole("button", { name: "Continuar" });
    expect(next.hasAttribute("disabled")).toBe(true);
  });
});

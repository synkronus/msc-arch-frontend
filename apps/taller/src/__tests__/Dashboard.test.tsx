import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderApp } from "../test-utils";
import { Dashboard } from "../features/inicio/Dashboard";
import { useApp } from "@smartgarage/store";

describe("Dashboard", () => {
  it("renders the workshop title", () => {
    renderApp(<Dashboard />);
    expect(screen.getByText(/Taller Mejía/)).toBeTruthy();
  });

  it("shows the Ingresos KPI for an owner with data loaded", async () => {
    await useApp.getState().login("owner@x.com", "demo");
    await useApp.getState().loadOrders();
    await useApp.getState().loadBookings();
    renderApp(<Dashboard />);
    expect(screen.getByText("Ingresos")).toBeTruthy();
  });
});

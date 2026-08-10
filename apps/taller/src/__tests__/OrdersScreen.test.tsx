import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderApp } from "../test-utils";
import { OrdersScreen } from "../features/ordenes/OrdersScreen";
import { useApp } from "@smartgarage/store";

describe("OrdersScreen", () => {
  it("renders the active and delivered sections", async () => {
    await useApp.getState().login("owner@x.com", "demo");
    await useApp.getState().loadOrders();
    renderApp(<OrdersScreen openOverlay={() => {}} />);
    expect(screen.getByText(/En el taller/)).toBeTruthy();
    expect(screen.getByText(/Entregadas/)).toBeTruthy();
  });
});

import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderApp } from "../test-utils";
import App from "../App";

describe("shell App", () => {
  it("renders the Launcher entry options", () => {
    renderApp(<App />);
    expect(screen.getByRole("button", { name: /Entrar como Cliente/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Entrar como Taller/i })).toBeTruthy();
  });

  it("renders the global nav with the roadmap domains disabled", () => {
    renderApp(<App />);
    expect(screen.getAllByText("Cliente").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Taller").length).toBeGreaterThan(0);
    expect(screen.getByText("Facturación")).toBeTruthy();
    expect(screen.getByText("Analítica")).toBeTruthy();
  });

  it("shows no session indicator before login", () => {
    renderApp(<App />);
    expect(screen.getByText("Sin sesión")).toBeTruthy();
  });
});

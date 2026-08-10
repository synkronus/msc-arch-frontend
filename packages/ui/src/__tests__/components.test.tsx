import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProvider } from "../test-utils";
import {
  PrimaryBtn,
  Field,
  Chip,
  KpiCard,
  Sheet,
  StepBar,
  Timeline,
} from "../index";
import { STATUS_LABEL } from "../tokens";

describe("ui components", () => {
  it("PrimaryBtn renders a button with its label", () => {
    renderWithProvider(<PrimaryBtn>Confirmar</PrimaryBtn>);
    expect(screen.getByRole("button", { name: "Confirmar" })).toBeTruthy();
  });

  it("Field renders the label and its child input", () => {
    renderWithProvider(
      <Field label="Placa">
        <input aria-label="placa-input" />
      </Field>,
    );
    expect(screen.getByText("Placa")).toBeTruthy();
    expect(screen.getByLabelText("placa-input")).toBeTruthy();
  });

  it("Chip renders the estado label", () => {
    renderWithProvider(<Chip estado="presupuesto" />);
    expect(screen.getByText(STATUS_LABEL.presupuesto)).toBeTruthy();
  });

  it("KpiCard renders label and value", () => {
    renderWithProvider(<KpiCard icon="$" label="Ingresos" value="$1.000.000" />);
    expect(screen.getByText("Ingresos")).toBeTruthy();
    expect(screen.getByText("$1.000.000")).toBeTruthy();
  });

  it("KpiCard renders the sub caption when provided", () => {
    renderWithProvider(<KpiCard icon="$" label="Ingresos" value="$1" sub="mes actual" />);
    expect(screen.getByText("mes actual")).toBeTruthy();
  });

  it("Sheet renders its title when opened", () => {
    renderWithProvider(
      <Sheet title="Nuevo cliente" opened onClose={() => {}}>
        body
      </Sheet>,
    );
    expect(screen.getByText("Nuevo cliente")).toBeTruthy();
  });

  it("StepBar renders the upcoming step numbers", () => {
    renderWithProvider(<StepBar step={2} />);
    expect(screen.getByText("3")).toBeTruthy();
    expect(screen.getByText("4")).toBeTruthy();
  });

  it("Timeline renders the given milestone labels", () => {
    renderWithProvider(
      <Timeline current={1} labels={["Recepción", "Diagnóstico", "Reparación"]} />,
    );
    expect(screen.getByText("Recepción")).toBeTruthy();
    expect(screen.getByText("Reparación")).toBeTruthy();
  });
});

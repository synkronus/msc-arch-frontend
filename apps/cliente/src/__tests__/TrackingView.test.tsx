import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderApp } from "../test-utils";
import { TrackingView } from "../features/seguimiento/TrackingView";

describe("TrackingView", () => {
  it("renders a milestone once the tracked order loads", async () => {
    renderApp(<TrackingView flash={() => {}} />);
    expect(await screen.findByText("Recepción")).toBeTruthy();
  });

  it("renders the technician recommendations", async () => {
    renderApp(<TrackingView flash={() => {}} />);
    expect(await screen.findByText("Recomendaciones del técnico")).toBeTruthy();
  });
});

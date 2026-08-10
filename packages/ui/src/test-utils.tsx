import { render, type RenderResult } from "@testing-library/react";
import type { ReactElement } from "react";
import { SmartGarageProvider } from "./provider";

export function renderWithProvider(ui: ReactElement): RenderResult {
  return render(<SmartGarageProvider>{ui}</SmartGarageProvider>);
}

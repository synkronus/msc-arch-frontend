import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { SmartGarageProvider } from "@smartgarage/ui";

export function renderApp(ui: ReactElement) {
  return render(
    <SmartGarageProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </SmartGarageProvider>,
  );
}

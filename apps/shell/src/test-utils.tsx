import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { SmartGarageProvider } from "@smartgarage/ui";

export function renderApp(ui: ReactElement) {
  return render(<SmartGarageProvider>{ui}</SmartGarageProvider>);
}

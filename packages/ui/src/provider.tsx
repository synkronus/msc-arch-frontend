import { MantineProvider } from "@mantine/core";
import type { ReactNode } from "react";
import { theme } from "./theme";

export function SmartGarageProvider({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      {children}
    </MantineProvider>
  );
}

import { Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Stack gap={6} mb={12}>
      <Text size="sm" fw={500} c="dimmed">
        {label}
      </Text>
      {children}
    </Stack>
  );
}

import { Paper, Text, Group, ThemeIcon, type MantineColor } from "@mantine/core";
import type { ReactNode } from "react";

export function KpiCard({
  icon,
  label,
  value,
  sub,
  accent = "slate",
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  sub?: string;
  accent?: MantineColor;
}) {
  return (
    <Paper p="md" radius="lg" withBorder shadow="xs">
      <Group gap="xs" c="dimmed">
        <ThemeIcon color={accent} variant="light" size="sm">
          {icon}
        </ThemeIcon>
        <Text size="xs" fw={500}>
          {label}
        </Text>
      </Group>
      <Text mt={6} size="xl" fw={700} style={{ fontVariantNumeric: "tabular-nums" }}>
        {value}
      </Text>
      {sub && (
        <Text size="xs" c="dimmed" mt={2}>
          {sub}
        </Text>
      )}
    </Paper>
  );
}

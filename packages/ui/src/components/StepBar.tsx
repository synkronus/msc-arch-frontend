import { Group, ThemeIcon } from "@mantine/core";

export function StepBar({ step }: { step: number }) {
  return (
    <Group gap="xs" px="md" py="sm" wrap="nowrap">
      {[1, 2, 3, 4].map((n) => (
        <Group gap="xs" key={n} wrap="nowrap">
          <ThemeIcon
            size={28}
            radius="xl"
            color={n <= step ? "amber" : "gray"}
            variant={n <= step ? "filled" : "subtle"}
          >
            {n < step ? "✓" : n}
          </ThemeIcon>
        </Group>
      ))}
    </Group>
  );
}

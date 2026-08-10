import { Stack, Group, ThemeIcon, Text } from "@mantine/core";

export function Timeline({ current, labels }: { current: number; labels: string[] }) {
  return (
    <Stack gap={0}>
      {labels.map((label, i) => {
        const done = i < current;
        const isCurrent = i === current;
        return (
          <Group key={label} align="flex-start" gap="sm" pb="sm" wrap="nowrap">
            <Stack align="center" gap={0}>
              <ThemeIcon
                size={22}
                radius="xl"
                color={done ? "green" : isCurrent ? "amber" : "gray"}
                variant={done || isCurrent ? "filled" : "subtle"}
              >
                {done ? "✓" : i + 1}
              </ThemeIcon>
              {i < labels.length - 1 && (
                <div
                  style={{
                    width: 2,
                    height: 18,
                    background: done ? "var(--mantine-color-green-6)" : "var(--mantine-color-gray-3)",
                  }}
                />
              )}
            </Stack>
            <Text
              size="sm"
              pt={1}
              fw={isCurrent ? 700 : 400}
              c={isCurrent ? "dark" : done ? "gray" : "dimmed"}
            >
              {label}
            </Text>
          </Group>
        );
      })}
    </Stack>
  );
}

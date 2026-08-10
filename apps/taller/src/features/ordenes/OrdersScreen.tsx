import { Box, Text, Group, Card, Center } from "@mantine/core";
import { useApp, selectTenantOrders, selectTenantCustomers } from "@smartgarage/store";
import { can, type Role, type ServiceOrder } from "@smartgarage/contracts";
import { Chip, cop } from "@smartgarage/ui";
import { customerName } from "../../lib/lookup";
import type { Overlay } from "../../App";

export function OrdersScreen({ openOverlay }: { openOverlay: (o: Overlay) => void }) {
  const orders = useApp(selectTenantOrders);
  const customers = useApp(selectTenantCustomers);
  const role: Role = useApp((s) => s.session?.role ?? "customer");

  const activas = orders.filter((o) => o.estado !== "entregado");
  const hist = orders.filter((o) => o.estado === "entregado");

  const Row = (o: ServiceOrder) => (
    <Card
      key={o.id}
      withBorder
      padding="sm"
      radius="md"
      mb="xs"
      onClick={() => openOverlay({ type: "order", id: o.id })}
      style={{ cursor: "pointer" }}
    >
      <Group gap="sm" wrap="nowrap">
        <Box style={{ flex: 1 }}>
          <Text size="sm" fw={600}>
            {o.motivo}
          </Text>
          <Text size="xs" c="dimmed">
            {customerName(customers, o.customerId)}
          </Text>
          <Box mt={4}>
            <Chip estado={o.estado} />
          </Box>
        </Box>
        {o.total > 0 && (
          <Text size="sm" fw={600}>
            {cop(o.total)}
          </Text>
        )}
      </Group>
    </Card>
  );

  return (
    <Box px="md" pt="sm" pb={64}>
      <Group justify="space-between" mb="sm">
        <Text fw={700} size="xl">
          Órdenes
        </Text>
        {can(role, "receive") && (
          <Text
            size="sm"
            fw={600}
            style={{ color: "#B45309", cursor: "pointer" }}
            onClick={() => openOverlay({ type: "newOrder" })}
          >
            + Nueva orden
          </Text>
        )}
      </Group>

      <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb="xs">
        En el taller ({activas.length})
      </Text>
      {activas.length === 0 ? (
        <Center c="dimmed" py="lg">
          <Text size="sm">No hay órdenes activas.</Text>
        </Center>
      ) : (
        activas.map(Row)
      )}

      <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb="xs" mt="md">
        Entregadas ({hist.length})
      </Text>
      {hist.map(Row)}
    </Box>
  );
}

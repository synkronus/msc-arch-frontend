import { Box, Text, Group, Card, Avatar, SimpleGrid } from "@mantine/core";
import { useApp, selectTenantOrders } from "@smartgarage/store";
import { Sheet, KpiCard, Chip, cop } from "@smartgarage/ui";

export function ClientDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const c = useApp((s) => s.customers.find((x) => x.id === id) ?? null);
  const orders = useApp(selectTenantOrders);

  if (!c) return null;

  const hist = orders.filter((o) => o.customerId === id);
  const entregadas = hist.filter((o) => o.estado === "entregado");
  const facturado = entregadas.reduce((a, o) => a + o.total, 0);

  return (
    <Sheet title="Cliente" opened onClose={onClose}>
      <Box px="md" py="md">
        <Group gap="sm" mb="md">
          <Avatar color="dark" size="lg" radius="xl">
            {c.nombre.charAt(0)}
          </Avatar>
          <Box>
            <Text fw={700} size="lg">
              {c.nombre}
            </Text>
            <Text size="sm" c="teal">
              {c.telefono}
            </Text>
          </Box>
        </Group>

        <SimpleGrid cols={2} mb="md">
          <KpiCard icon="🛠" label="Servicios" value={entregadas.length} sub="entregados" />
          <KpiCard icon="💵" label="Facturado" value={cop(facturado)} sub={`desde ${c.desde}`} accent="orange" />
        </SimpleGrid>

        <Text fw={600} size="sm" mb="xs">
          Vehículos
        </Text>
        {c.vehiculos.map((v) => (
          <Card key={v.id} withBorder padding="sm" radius="md" mb="xs">
            <Text size="sm" fw={600}>
              {v.marca} {v.modelo}
            </Text>
            <Text size="xs" c="dimmed">
              Placa {v.placa}
            </Text>
          </Card>
        ))}

        <Text fw={600} size="sm" mb="xs" mt="md">
          Historial
        </Text>
        {hist.length === 0 && (
          <Text size="sm" c="dimmed">
            Sin servicios todavía.
          </Text>
        )}
        {hist.map((o) => (
          <Card key={o.id} withBorder padding="sm" radius="md" mb="xs">
            <Group justify="space-between">
              <Box>
                <Text size="sm">{o.motivo}</Text>
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
        ))}
      </Box>
    </Sheet>
  );
}

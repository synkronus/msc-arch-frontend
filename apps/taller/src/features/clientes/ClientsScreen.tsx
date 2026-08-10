import { useState } from "react";
import { Box, Text, Group, Card, TextInput, Avatar } from "@mantine/core";
import { useApp, selectTenantCustomers, selectTenantOrders } from "@smartgarage/store";
import { can, type Role } from "@smartgarage/contracts";
import { color } from "@smartgarage/ui";
import type { Overlay } from "../../App";

export function ClientsScreen({ openOverlay }: { openOverlay: (o: Overlay) => void }) {
  const customers = useApp(selectTenantCustomers);
  const orders = useApp(selectTenantOrders);
  const role: Role = useApp((s) => s.session?.role ?? "customer");
  const [q, setQ] = useState("");

  const list = customers.filter((c) =>
    (c.nombre + c.vehiculos.map((v) => v.placa).join("")).toLowerCase().includes(q.toLowerCase()),
  );
  const visits = (cid: string) =>
    orders.filter((o) => o.customerId === cid && o.estado === "entregado").length;

  return (
    <Box px="md" pt="sm" pb={64}>
      <Group justify="space-between" mb="sm">
        <Text fw={700} size="xl">
          Clientes
        </Text>
        {can(role, "receive") && (
          <Text
            size="sm"
            fw={600}
            style={{ color: "#B45309", cursor: "pointer" }}
            onClick={() => openOverlay({ type: "newClient" })}
          >
            + Nuevo
          </Text>
        )}
      </Group>

      <TextInput
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar por nombre o placa"
        mb="sm"
      />

      {list.map((c) => (
        <Card
          key={c.id}
          withBorder
          padding="sm"
          radius="md"
          mb="xs"
          onClick={() => openOverlay({ type: "client", id: c.id })}
          style={{ cursor: "pointer" }}
        >
          <Group gap="sm" wrap="nowrap">
            <Avatar color="dark" radius="xl">{c.nombre.charAt(0)}</Avatar>
            <Box style={{ flex: 1 }}>
              <Group gap="sm">
                <Text size="sm" fw={600}>
                  {c.nombre}
                </Text>
                {visits(c.id) > 1 && (
                  <Text size="xs" px={6} py={1} style={{ background: "#EDE9FE", color: "#6D28D9", borderRadius: 999 }}>
                    Recurrente
                  </Text>
                )}
              </Group>
              <Text size="xs" c="dimmed">
                {c.vehiculos[0] ? `${c.vehiculos[0].marca} ${c.vehiculos[0].modelo} · ${c.vehiculos[0].placa}` : ""}
              </Text>
            </Box>
          </Group>
        </Card>
      ))}
    </Box>
  );
}

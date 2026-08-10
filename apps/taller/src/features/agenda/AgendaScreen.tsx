import { useMemo } from "react";
import { Box, Text, Group, Card, Center } from "@mantine/core";
import { useApp, selectTenantBookings, selectTenantCustomers } from "@smartgarage/store";
import { can, type Role } from "@smartgarage/contracts";
import { customerName, vehicleLabel } from "../../lib/lookup";
import type { Overlay } from "../../App";

export function AgendaScreen({
  openOverlay,
  flash,
}: {
  openOverlay: (o: Overlay) => void;
  flash: (m: string) => void;
}) {
  const bookings = useApp(selectTenantBookings);
  const customers = useApp(selectTenantCustomers);
  const createOrder = useApp((s) => s.createOrder);
  const role: Role = useApp((s) => s.session?.role ?? "customer");

  const byDate = useMemo(() => {
    const groups: Record<string, typeof bookings> = {};
    [...bookings]
      .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))
      .forEach((b) => {
        (groups[b.fecha] = groups[b.fecha] ?? []).push(b);
      });
    return groups;
  }, [bookings]);

  const fmtDate = (d: string) =>
    new Date(d + "T00:00:00").toLocaleDateString("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  const recibir = async (customerId: string, vehicleId: string, servicio: string, canal: "digital" | "presencial") => {
    const o = await createOrder({ customerId, vehicleId, motivo: servicio, canal });
    flash("Orden de servicio abierta");
    openOverlay({ type: "order", id: o.id });
  };

  return (
    <Box px="md" pt="sm" pb={64}>
      <Group justify="space-between" mb="sm">
        <Text fw={700} size="xl">
          Agenda
        </Text>
        <Text
          size="sm"
          fw={600}
          style={{ color: "#B45309", cursor: "pointer" }}
          onClick={() => openOverlay({ type: "newCita" })}
        >
          + Nueva cita
        </Text>
      </Group>

      {Object.keys(byDate).length === 0 && (
        <Center c="dimmed" py="xl">
          <Text size="sm">No hay citas programadas. Crea la primera.</Text>
        </Center>
      )}

      {Object.entries(byDate).map(([fecha, list]) => (
        <Box key={fecha} mb="md">
          <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb="xs">
            {fmtDate(fecha)}
          </Text>
          {list.map((c) => (
            <Card key={c.id} withBorder padding="sm" radius="md" mb="xs">
              <Group gap="sm" wrap="nowrap">
                <Text fw={700} size="md" style={{ minWidth: 48 }}>
                  {c.hora}
                </Text>
                <Box style={{ flex: 1 }}>
                  <Text size="sm" fw={600}>
                    {c.servicio}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {customerName(customers, c.customerId)}
                  </Text>
                  <Text size="xs" c={c.canal === "digital" ? "teal" : "dimmed"}>
                    {c.canal === "digital" ? "WhatsApp" : "Presencial"}
                  </Text>
                </Box>
                {can(role, "receive") && (
                  <Text
                    size="xs"
                    fw={700}
                    style={{ color: "#F59E0B", cursor: "pointer" }}
                    onClick={() => recibir(c.customerId, c.vehicleId, c.servicio, c.canal)}
                  >
                    Recibir
                  </Text>
                )}
              </Group>
            </Card>
          ))}
        </Box>
      ))}
    </Box>
  );
}

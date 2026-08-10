import { Box, Text, Group, Card, Divider } from "@mantine/core";
import { useApp, selectTenantCustomers } from "@smartgarage/store";
import { ORDER_STATES, NEXT_LABEL, can, type Role } from "@smartgarage/contracts";
import { Sheet, PrimaryBtn, Chip, Timeline, cop, color } from "@smartgarage/ui";
import { customerName, vehicleLabel } from "../../lib/lookup";
import type { Overlay } from "../../App";

export function OrderDetail({
  id,
  onClose,
  openOverlay,
  flash,
}: {
  id: string;
  onClose: () => void;
  openOverlay: (o: Overlay) => void;
  flash: (m: string) => void;
}) {
  const order = useApp((s) => s.orders.find((o) => o.id === id) ?? null);
  const customers = useApp(selectTenantCustomers);
  const role: Role = useApp((s) => s.session?.role ?? "customer");
  const advance = useApp((s) => s.advance);
  const sendApproval = useApp((s) => s.sendApproval);

  if (!order) return null;

  const i = ORDER_STATES.indexOf(order.estado);
  const nextLabel = NEXT_LABEL[order.estado];
  const advanceBlocked = order.estado === "presupuesto" && order.items.length === 0;
  const roleBlocked = !can(role, "advance");
  const total = order.items.reduce((a, it) => a + it.valor, 0);

  const doNext = async () => {
    try {
      if (order.estado === "presupuesto") {
        await sendApproval(order.id);
        flash("Presupuesto enviado por WhatsApp · aprobado");
      } else {
        await advance(order.id);
        const ns = ORDER_STATES[i + 1];
        if (ns) flash(`Orden → ${ns}`);
      }
    } catch (e) {
      flash((e as Error).message);
    }
  };

  return (
    <Sheet title="Orden de servicio" opened onClose={onClose}>
      <Box px="md" py="md">
        <Card withBorder padding="md" radius="md" mb="sm">
          <Text fw={700} size="lg">
            {order.motivo}
          </Text>
          <Text size="sm" c="dimmed">
            {customerName(customers, order.customerId)}
          </Text>
          <Text size="sm" c="dimmed">
            {vehicleLabel(customers, order.customerId, order.vehicleId)}
          </Text>
          <Box mt="xs">
            <Chip estado={order.estado} />
          </Box>
        </Card>

        <Card withBorder padding="md" radius="md" mb="sm">
          <Text fw={600} size="sm" mb="sm">
            Avance
          </Text>
          <Timeline current={i} labels={ORDER_STATES.map((s) => s)} />
        </Card>

        {(order.items.length > 0 || order.estado === "diagnostico" || order.estado === "presupuesto") && (
          <Card withBorder padding="md" radius="md" mb="sm">
            <Group justify="space-between" mb="xs">
              <Text fw={600} size="sm">
                Presupuesto
              </Text>
              {(can(role, "work") || can(role, "advance")) && i <= 2 && (
                <Text
                  size="xs"
                  fw={600}
                  style={{ color: color.amberD, cursor: "pointer" }}
                  onClick={() => openOverlay({ type: "addItem", id: order.id })}
                >
                  + Agregar
                </Text>
              )}
            </Group>
            {order.items.length === 0 && (
              <Text size="sm" c="dimmed">
                Aún sin ítems. Agrega mano de obra y repuestos.
              </Text>
            )}
            {order.items.map((it, k) => (
              <Group key={k} justify="space-between" mb={2}>
                <Box>
                  <Text size="sm">{it.desc}</Text>
                  <Text size="xs" c="dimmed">
                    {it.tipo === "mano_de_obra" ? "Mano de obra" : "Repuesto"}
                  </Text>
                </Box>
                <Text size="sm" fw={600}>
                  {cop(it.valor)}
                </Text>
              </Group>
            ))}
            {order.items.length > 0 && <Divider my="xs" />}
            {order.items.length > 0 && (
              <Group justify="space-between">
                <Text fw={700}>Total</Text>
                <Text fw={700}>{cop(total)}</Text>
              </Group>
            )}
          </Card>
        )}

        {roleBlocked && nextLabel && (
          <Card withBorder padding="sm" radius="md" mb="sm" style={{ background: "#FEF3C7" }}>
            <Text size="sm" style={{ color: color.amberD }}>
              Tu rol ({role}) no puede avanzar esta orden.
            </Text>
          </Card>
        )}
      </Box>

      {nextLabel && (
        <Box p="md" style={{ borderTop: "1px solid #E2E8F0", background: "white" }}>
          <PrimaryBtn disabled={advanceBlocked || roleBlocked} onClick={doNext}>
            {nextLabel}
          </PrimaryBtn>
        </Box>
      )}
    </Sheet>
  );
}

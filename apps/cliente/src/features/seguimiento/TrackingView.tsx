import { useEffect } from "react";
import { Stack, Text, Group, Card, Badge, Button, Divider } from "@mantine/core";
import { Timeline, cop, MILESTONE_LABEL, color } from "@smartgarage/ui";
import { toCustomerMilestone, CUSTOMER_MILESTONES } from "@smartgarage/contracts";
import { useApp } from "@smartgarage/store";

const HEALTH_BADGE: Record<string, { color: string; label: string }> = {
  urgente: { color: "red", label: "Requiere atención" },
  atencion: { color: "orange", label: "Vigilar" },
  bien: { color: "green", label: "En buen estado" },
};

export function TrackingView({ flash }: { flash: (m: string) => void }) {
  const trackedOrder = useApp((s) => s.trackedOrder);
  const recommendations = useApp((s) => s.recommendations);
  const health = useApp((s) => s.health);
  const trackOrder = useApp((s) => s.trackOrder);
  const subscribeOrder = useApp((s) => s.subscribeOrder);
  const respondRecommendation = useApp((s) => s.respondRecommendation);

  useEffect(() => {
    trackOrder("o_demo");
  }, [trackOrder]);

  useEffect(() => {
    const unsub = subscribeOrder("o_demo");
    return unsub;
  }, [subscribeOrder]);

  if (!trackedOrder) {
    return (
      <Text p="md" c="dimmed">
        Cargando tu orden…
      </Text>
    );
  }

  const curMilestone = toCustomerMilestone[trackedOrder.estado];
  const curIdx = CUSTOMER_MILESTONES.indexOf(curMilestone);
  const approvedExtra = recommendations
    .filter((r) => r.estado === "aprobado")
    .reduce((a, r) => a + r.precio, 0);
  const baseTotal = trackedOrder.items.reduce((a, it) => a + it.valor, 0);
  const grand = baseTotal + approvedExtra;

  return (
    <Stack px="md" py="sm" gap="md">
      <Card style={{ background: color.ink }} padding="md" radius="lg">
        <Text c="white" fw={700}>
          {trackedOrder.motivo}
        </Text>
        <Badge mt="sm" color="amber">
          {MILESTONE_LABEL[curMilestone]}
        </Badge>
      </Card>

      <Card withBorder padding="md" radius="lg">
        <Text fw={600} mb="sm">
          Estado de tu carro
        </Text>
        <Timeline
          current={curIdx}
          labels={CUSTOMER_MILESTONES.map((m) => MILESTONE_LABEL[m])}
        />
      </Card>

      <Card withBorder padding="md" radius="lg">
        <Text fw={600}>Recomendaciones del técnico</Text>
        <Text size="xs" c="dimmed" mb="sm">
          Tú decides qué autorizar. Nada se hace sin tu aprobación.
        </Text>
        {recommendations.map((r) => (
          <Group
            key={r.id}
            justify="space-between"
            mb="sm"
            align="center"
            wrap="nowrap"
          >
            <Stack gap={0} style={{ minWidth: 0 }}>
              <Text size="sm" fw={600}>
                {r.nombre}
              </Text>
              <Text size="xs" c="dimmed">
                {cop(r.precio)} · {r.nivel === "urgente" ? "Urgente" : "Recomendado"}
              </Text>
            </Stack>
            {r.estado === "pendiente" ? (
              <Group gap="xs" wrap="nowrap">
                <Button
                  size="xs"
                  variant="subtle"
                  color="gray"
                  onClick={() => respondRecommendation(r.id, "rechazado")}
                >
                  Ahora no
                </Button>
                <Button
                  size="xs"
                  color="amber"
                  onClick={() => {
                    respondRecommendation(r.id, "aprobado");
                    flash("Trabajo aprobado");
                  }}
                >
                  Aprobar
                </Button>
              </Group>
            ) : (
              <Badge color={r.estado === "aprobado" ? "green" : "gray"}>
                {r.estado === "aprobado" ? "Aprobado" : "Rechazado"}
              </Badge>
            )}
          </Group>
        ))}
      </Card>

      <Card withBorder padding="md" radius="lg">
        <Text fw={600} mb="sm">
          Mapa de salud
        </Text>
        {health.map((h) => {
          const badge = HEALTH_BADGE[h.estado] ?? { color: "gray", label: h.estado };
          return (
            <Group key={h.sistema} justify="space-between" mb={4}>
              <Text size="sm">{h.sistema}</Text>
              <Badge color={badge.color} variant="light">
                {badge.label}
              </Badge>
            </Group>
          );
        })}
      </Card>

      <Card withBorder padding="md" radius="lg">
        <Text fw={600} mb="sm">
          Resumen
        </Text>
        {trackedOrder.items.map((t, i) => (
          <Group key={i} justify="space-between">
            <Text size="sm" c="dimmed">
              {t.desc}
            </Text>
            <Text size="sm" fw={600}>
              {cop(t.valor)}
            </Text>
          </Group>
        ))}
        {recommendations
          .filter((r) => r.estado === "aprobado")
          .map((r) => (
            <Group key={r.id} justify="space-between">
              <Text size="sm" c="dimmed">
                {r.nombre}
              </Text>
              <Text size="sm" fw={600}>
                {cop(r.precio)}
              </Text>
            </Group>
          ))}
        <Divider my="sm" />
        <Group justify="space-between">
          <Text fw={700}>Total</Text>
          <Text fw={700} style={{ color: color.amberD }}>
            {cop(grand)}
          </Text>
        </Group>
      </Card>
    </Stack>
  );
}

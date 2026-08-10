import { useMemo } from "react";
import { Box, Text, Card, Group } from "@mantine/core";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { useApp, selectTenantOrders, selectTenantBookings } from "@smartgarage/store";
import { computeKpis, can, ORDER_STATES, type Role } from "@smartgarage/contracts";
import { KpiCard, cop, STATUS_STYLE, STATUS_LABEL } from "@smartgarage/ui";

const fmtHoras = (h: number) =>
  h >= 24 ? `${Math.floor(h / 24)}d ${Math.round(h % 24)}h` : `${h.toFixed(1)} h`;

export function Dashboard() {
  const orders = useApp(selectTenantOrders);
  const bookings = useApp(selectTenantBookings);
  const role: Role = useApp((s) => s.session?.role ?? "customer");
  const kpis = useMemo(() => computeKpis(orders, bookings), [orders, bookings]);

  const chartData = ORDER_STATES.map((s) => ({
    estado: STATUS_LABEL[s].length > 7 ? STATUS_LABEL[s].slice(0, 6) + "." : STATUS_LABEL[s],
    full: s,
    n: orders.filter((o) => o.estado === s).length,
  }));

  return (
    <Box px="md" pt="sm" pb={64}>
      <Text size="sm" c="dimmed">
        Resumen de hoy
      </Text>
      <Text fw={700} size="xl" mb="sm">
        Taller Mejía · Kennedy
      </Text>

      {can(role, "kpis") ? (
        <Box style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <KpiCard icon="⏱" label="Tiempo de atención" value={fmtHoras(kpis.tiempoPromedioHoras)} sub="promedio por orden" accent="blue" />
          <KpiCard icon="💬" label="Citas digitales" value={`${Math.round(kpis.pctCitasDigitales)}%`} sub="del total agendado" accent="green" />
          <KpiCard icon="🔁" label="Recurrencia" value={`${Math.round(kpis.tasaRecurrencia)}%`} sub="clientes que regresan" accent="grape" />
          <KpiCard icon="💵" label="Ingresos" value={cop(kpis.ingresos)} sub="órdenes entregadas" accent="orange" />
        </Box>
      ) : (
        <Card withBorder padding="md" radius="md">
          <Text size="sm" c="dimmed">
            Los indicadores financieros son visibles para Administrador y Dueño. Rol actual:{" "}
            <b>{role}</b>.
          </Text>
        </Card>
      )}

      <Card withBorder padding="md" radius="md" mt="md">
        <Group justify="space-between" mb="xs">
          <Text fw={600} size="sm">
            Órdenes por estado
          </Text>
          <Text size="xs" c="dimmed">
            {kpis.activas} activas
          </Text>
        </Group>
        <Box style={{ width: "100%", height: 150 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
              <XAxis dataKey="estado" tick={{ fontSize: 9, fill: "#64748B" }} interval={0} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#94A3B8" }} />
              <Tooltip />
              <Bar dataKey="n" radius={[4, 4, 0, 0]}>
                {chartData.map((d) => (
                  <Cell key={d.full} fill={STATUS_STYLE[d.full].fg} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Card>
    </Box>
  );
}

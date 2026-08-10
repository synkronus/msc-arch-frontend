import type { ServiceOrder, Booking, Kpis } from "./entities";

const HOUR = 3_600_000;

export function computeKpis(orders: ServiceOrder[], bookings: Booking[]): Kpis {
  const entregadas = orders.filter(
    (o): o is ServiceOrder & { entregadoAt: string } =>
      o.estado === "entregado" && o.entregadoAt !== null,
  );

  const horas = entregadas.map(
    (o) => (Date.parse(o.entregadoAt) - Date.parse(o.recibidoAt)) / HOUR,
  );
  const tiempoPromedioHoras = horas.length
    ? horas.reduce((a, b) => a + b, 0) / horas.length
    : 0;

  const pctCitasDigitales = bookings.length
    ? (bookings.filter((b) => b.canal === "digital").length / bookings.length) * 100
    : 0;

  const visitas: Record<string, number> = {};
  for (const o of entregadas) visitas[o.customerId] = (visitas[o.customerId] ?? 0) + 1;
  const conVisita = Object.keys(visitas).length;
  const tasaRecurrencia = conVisita
    ? (Object.values(visitas).filter((n) => n > 1).length / conVisita) * 100
    : 0;

  const ingresos = entregadas.reduce((a, o) => a + (o.total ?? 0), 0);

  return {
    tiempoPromedioHoras,
    pctCitasDigitales,
    tasaRecurrencia,
    ingresos,
    activas: orders.filter((o) => o.estado !== "entregado").length,
    entregadas: entregadas.length,
  };
}

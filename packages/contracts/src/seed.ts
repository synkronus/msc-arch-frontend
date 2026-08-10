import type {
  Tenant, Customer, ServiceOrder, Booking,
  ServiceType, Workshop, Recommendation, HealthEntry, Session,
} from "./entities";

const HOUR = 3600 * 1000;
const DAY = 24 * HOUR;
const now = Date.now();
const iso = (ms: number) => new Date(ms).toISOString();
const date = (ms: number) => new Date(ms).toISOString().slice(0, 10);

const tenants: Tenant[] = [
  { id: "t1", nombre: "Taller Mejía" },
];

const customers: Customer[] = [
  { id: "c1", tenantId: "t1", nombre: "Carlos Mejía", telefono: "300 412 7788", desde: "2024",
    vehiculos: [{ id: "v1", placa: "KLM45C", marca: "Chevrolet", modelo: "Sail 2018" }] },
  { id: "c2", tenantId: "t1", nombre: "Diana Ramírez", telefono: "311 256 9032", desde: "2023",
    vehiculos: [{ id: "v2", placa: "GFR21D", marca: "Renault", modelo: "Logan 2019" }] },
  { id: "c3", tenantId: "t1", nombre: "Andrés Quintero", telefono: "320 778 1145", desde: "2025",
    vehiculos: [{ id: "v3", placa: "HJK88F", marca: "Mazda", modelo: "3 2020" }] },
  { id: "c4", tenantId: "t1", nombre: "Liliana Torres", telefono: "315 990 4521", desde: "2022",
    vehiculos: [{ id: "v4", placa: "BNM33G", marca: "Nissan", modelo: "Versa 2017" }] },
  { id: "c5", tenantId: "t1", nombre: "Jorge Patiño", telefono: "301 334 6677", desde: "2024",
    vehiculos: [{ id: "v5", placa: "TRV09H", marca: "Kia", modelo: "Rio 2021" }] },
  { id: "c6", tenantId: "t1", nombre: "Marcela Ruiz", telefono: "318 442 1199", desde: "2025",
    vehiculos: [{ id: "v6", placa: "PQS77J", marca: "Hyundai", modelo: "Accent 2016" }] },
];

const catalog: ServiceType[] = [
  { id: "m1", nombre: "Cambio de aceite y filtro", categoria: "mantenimiento", precio: 185000 },
  { id: "m2", nombre: "Sincronización", categoria: "mantenimiento", precio: 210000 },
  { id: "m3", nombre: "Alineación y balanceo", categoria: "mantenimiento", precio: 140000 },
  { id: "m4", nombre: "Cambio de bujías", categoria: "mantenimiento", precio: 120000 },
  { id: "f1", nombre: "Pastillas delanteras", categoria: "frenos", precio: 240000 },
  { id: "f2", nombre: "Discos de freno (par)", categoria: "frenos", precio: 380000 },
  { id: "f3", nombre: "Cambio de líquido de frenos", categoria: "frenos", precio: 90000 },
  { id: "e1", nombre: "Diagnóstico electrónico (scanner)", categoria: "motor", precio: 80000 },
  { id: "e2", nombre: "Cambio de correa de repartición", categoria: "motor", precio: 320000 },
  { id: "e3", nombre: "Revisión de fugas (desde)", categoria: "motor", precio: 250000 },
  { id: "s1", nombre: "Amortiguadores (par)", categoria: "suspension", precio: 420000 },
  { id: "s2", nombre: "Terminales y rótulas", categoria: "suspension", precio: 190000 },
];

const workshops: Workshop[] = [
  { id: "t1", nombre: "Taller Mejía", zona: "Kennedy", rating: 4.8, km: 3.2, direccion: "Cra. 78 #38-20" },
  { id: "t2", nombre: "AutoExpress Norte", zona: "Suba", rating: 4.6, km: 6.1, direccion: "Calle 145 #91-30" },
  { id: "t3", nombre: "MecániCenter", zona: "Chapinero", rating: 4.7, km: 4.5, direccion: "Cra. 13 #54-12" },
];

const orders: ServiceOrder[] = [
  { id: "o1", tenantId: "t1", customerId: "c1", vehicleId: "v1",
    motivo: "Cambio de aceite y filtros", estado: "entregado", canal: "digital",
    recibidoAt: iso(now - 9 * DAY), entregadoAt: iso(now - 9 * DAY + 5 * HOUR), total: 185000,
    items: [{ desc: "Mano de obra", tipo: "mano_de_obra", valor: 60000 }, { desc: "Aceite 5W30 + filtros", tipo: "repuesto", valor: 125000 }] },
  { id: "o2", tenantId: "t1", customerId: "c2", vehicleId: "v2",
    motivo: "Pastillas de freno delanteras", estado: "entregado", canal: "digital",
    recibidoAt: iso(now - 7 * DAY), entregadoAt: iso(now - 7 * DAY + 6 * HOUR), total: 240000,
    items: [{ desc: "Mano de obra", tipo: "mano_de_obra", valor: 90000 }, { desc: "Juego pastillas", tipo: "repuesto", valor: 150000 }] },
  { id: "o3", tenantId: "t1", customerId: "c1", vehicleId: "v1",
    motivo: "Revisión de suspensión", estado: "entregado", canal: "presencial",
    recibidoAt: iso(now - 4 * DAY), entregadoAt: iso(now - 4 * DAY + 28 * HOUR), total: 420000,
    items: [{ desc: "Mano de obra", tipo: "mano_de_obra", valor: 180000 }, { desc: "Amortiguadores (par)", tipo: "repuesto", valor: 240000 }] },
  { id: "o4", tenantId: "t1", customerId: "c4", vehicleId: "v4",
    motivo: "Sincronización y bujías", estado: "entregado", canal: "digital",
    recibidoAt: iso(now - 3 * DAY), entregadoAt: iso(now - 3 * DAY + 7 * HOUR), total: 210000,
    items: [{ desc: "Mano de obra", tipo: "mano_de_obra", valor: 110000 }, { desc: "Juego de bujías", tipo: "repuesto", valor: 100000 }] },
  { id: "o5", tenantId: "t1", customerId: "c3", vehicleId: "v3",
    motivo: "Ruido en tren delantero", estado: "diagnostico", canal: "digital",
    recibidoAt: iso(now - 5 * HOUR), entregadoAt: null, total: 0, items: [] },
  { id: "o6", tenantId: "t1", customerId: "c5", vehicleId: "v5",
    motivo: "Cambio de embrague", estado: "presupuesto", canal: "presencial",
    recibidoAt: iso(now - 1 * DAY), entregadoAt: null, total: 0,
    items: [{ desc: "Mano de obra", tipo: "mano_de_obra", valor: 350000 }, { desc: "Kit de embrague", tipo: "repuesto", valor: 480000 }] },
];

const bookings: Booking[] = [
  { id: "b1", tenantId: "t1", customerId: "c6", vehicleId: "v6", servicio: "Cambio de aceite",
    fecha: date(now + DAY), hora: "09:00", canal: "digital", recordatorio: true, estado: "programada" },
  { id: "b2", tenantId: "t1", customerId: "c2", vehicleId: "v2", servicio: "Revisión general",
    fecha: date(now + DAY), hora: "11:30", canal: "digital", recordatorio: true, estado: "programada" },
  { id: "b3", tenantId: "t1", customerId: "c4", vehicleId: "v4", servicio: "Alineación y balanceo",
    fecha: date(now + 2 * DAY), hora: "14:00", canal: "presencial", recordatorio: false, estado: "programada" },
];

const recommendations: Recommendation[] = [
  { id: "r1", orderId: "o_demo", nombre: "Pastillas de freno delanteras", precio: 240000, nivel: "urgente", estado: "pendiente" },
  { id: "r2", orderId: "o_demo", nombre: "Cambio de líquido de frenos", precio: 90000, nivel: "recomendado", estado: "pendiente" },
];

const health: HealthEntry[] = [
  { sistema: "Frenos", estado: "urgente" },
  { sistema: "Motor", estado: "atencion" },
  { sistema: "Suspensión", estado: "bien" },
  { sistema: "Llantas", estado: "bien" },
  { sistema: "Eléctrico", estado: "bien" },
];

const sessions: Session[] = [
  { userId: "u1", tenantId: "t1", role: "owner", token: "mock-token-owner" },
  { userId: "u_customer", tenantId: "t1", role: "customer", token: "mock-token-customer" },
];

const trackedOrder: ServiceOrder & { vehDesc: string; placa: string; tallerDesc: string } = {
  id: "o_demo", tenantId: "t1", customerId: "c1", vehicleId: "v1",
  motivo: "Mantenimiento + diagnóstico", estado: "diagnostico", canal: "digital",
  items: [
    { desc: "Diagnóstico electrónico", tipo: "mano_de_obra", valor: 80000 },
    { desc: "Cambio de aceite y filtro", tipo: "repuesto", valor: 185000 },
  ],
  total: 265000,
  recibidoAt: iso(now - 3 * HOUR), entregadoAt: null,
  vehDesc: "Chevrolet Sail 2018", placa: "KLM45C", tallerDesc: "Taller Mejía · Kennedy",
};

export const seed = {
  tenants,
  customers,
  orders,
  bookings,
  catalog,
  workshops,
  recommendations,
  health,
  sessions,
  trackedOrder,
};

export type Seed = typeof seed;

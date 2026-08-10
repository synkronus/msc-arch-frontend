import { z } from "zod";
import { ORDER_STATES } from "./order-machine";

export const zVehicle = z.object({
  id: z.string(),
  placa: z.string().min(1),
  marca: z.string().min(1),
  modelo: z.string().min(1),
  anio: z.number().int().positive().optional(),
});

export const zCustomer = z.object({
  id: z.string(),
  tenantId: z.string(),
  nombre: z.string().min(1),
  telefono: z.string().min(1),
  desde: z.string(),
  vehiculos: z.array(zVehicle),
});

export const zSession = z.object({
  userId: z.string(),
  tenantId: z.string(),
  role: z.enum([
    "saas_admin", "owner", "workshop_admin",
    "technician", "receptionist", "customer",
  ]),
  token: z.string(),
});

export const zServiceType = z.object({
  id: z.string(),
  nombre: z.string().min(1),
  categoria: z.enum(["mantenimiento", "frenos", "motor", "suspension"]),
  precio: z.number().nonnegative(),
});

export const zWorkshop = z.object({
  id: z.string(),
  nombre: z.string().min(1),
  zona: z.string(),
  rating: z.number().min(0).max(5),
  km: z.number().nonnegative(),
  direccion: z.string(),
});

export const zBooking = z.object({
  id: z.string(),
  tenantId: z.string(),
  customerId: z.string(),
  vehicleId: z.string(),
  servicio: z.string().min(1),
  fecha: z.string(),
  hora: z.string(),
  canal: z.enum(["digital", "presencial"]),
  recordatorio: z.boolean(),
  estado: z.enum(["programada", "cumplida", "cancelada"]),
});

export const zOrderItem = z.object({
  desc: z.string().min(1),
  tipo: z.enum(["mano_de_obra", "repuesto"]),
  valor: z.number().int().positive(),
});

export const zServiceOrder = z.object({
  id: z.string(),
  tenantId: z.string(),
  customerId: z.string(),
  vehicleId: z.string(),
  motivo: z.string().min(1),
  estado: z.enum(ORDER_STATES),
  canal: z.enum(["digital", "presencial"]),
  items: z.array(zOrderItem),
  total: z.number().int().nonnegative(),
  recibidoAt: z.string(),
  entregadoAt: z.string().nullable(),
});

export const zRecommendation = z.object({
  id: z.string(),
  orderId: z.string(),
  nombre: z.string().min(1),
  precio: z.number().nonnegative(),
  nivel: z.enum(["urgente", "recomendado"]),
  estado: z.enum(["pendiente", "aprobado", "rechazado"]),
});

export const zHealthEntry = z.object({
  sistema: z.string().min(1),
  estado: z.enum(["urgente", "atencion", "bien"]),
});

export const zKpis = z.object({
  tiempoPromedioHoras: z.number(),
  pctCitasDigitales: z.number(),
  tasaRecurrencia: z.number(),
  ingresos: z.number(),
  activas: z.number(),
  entregadas: z.number(),
});

import type { OrderState } from "./order-machine";
import type { Role } from "./roles";

export interface Tenant {
  id: string;
  nombre: string;
}

export interface Vehicle {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  anio?: number;
}

export interface Customer {
  id: string;
  tenantId: string;
  nombre: string;
  telefono: string;
  desde: string;
  vehiculos: Vehicle[];
}

export interface Session {
  userId: string;
  tenantId: string;
  role: Role;
  token: string;
}

export type ServiceCategory = "mantenimiento" | "frenos" | "motor" | "suspension";

export interface ServiceType {
  id: string;
  nombre: string;
  categoria: ServiceCategory;
  precio: number;
}

export interface Workshop {
  id: string;
  nombre: string;
  zona: string;
  rating: number;
  km: number;
  direccion: string;
}

export type Channel = "digital" | "presencial";

export type BookingState = "programada" | "cumplida" | "cancelada";

export interface Booking {
  id: string;
  tenantId: string;
  customerId: string;
  vehicleId: string;
  servicio: string;
  fecha: string;
  hora: string;
  canal: Channel;
  recordatorio: boolean;
  estado: BookingState;
}

export type ItemKind = "mano_de_obra" | "repuesto";

export interface OrderItem {
  desc: string;
  tipo: ItemKind;
  valor: number;
}

export interface ServiceOrder {
  id: string;
  tenantId: string;
  customerId: string;
  vehicleId: string;
  motivo: string;
  estado: OrderState;
  canal: Channel;
  items: OrderItem[];
  total: number;
  recibidoAt: string;
  entregadoAt: string | null;
}

export type RecLevel = "urgente" | "recomendado";
export type RecState = "pendiente" | "aprobado" | "rechazado";

export interface Recommendation {
  id: string;
  orderId: string;
  nombre: string;
  precio: number;
  nivel: RecLevel;
  estado: RecState;
}

export type SystemHealth = "urgente" | "atencion" | "bien";

export interface HealthEntry {
  sistema: string;
  estado: SystemHealth;
}

export interface Kpis {
  tiempoPromedioHoras: number;
  pctCitasDigitales: number;
  tasaRecurrencia: number;
  ingresos: number;
  activas: number;
  entregadas: number;
}

export type NewBooking = Omit<Booking, "id" | "tenantId" | "estado">;

export type NewOrder = Pick<ServiceOrder, "customerId" | "vehicleId" | "motivo" | "canal"> & {
  items?: OrderItem[];
};

export interface NewCustomer {
  nombre: string;
  telefono: string;
  placa: string;
  marca: string;
  modelo: string;
  anio?: number;
}

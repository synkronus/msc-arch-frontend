import type {
  Session,
  ServiceType,
  Workshop,
  Booking,
  ServiceOrder,
  Recommendation,
  HealthEntry,
  Customer,
  OrderItem,
  NewBooking,
  NewOrder,
  NewCustomer,
} from "@smartgarage/contracts";

export type OrderCreateInput = NewOrder & { tenantId: string };
export type BookingCreateInput = NewBooking & { tenantId: string };
export type CustomerCreateInput = NewCustomer & { tenantId: string };

export interface ApiClient {
  login(email: string, pwd: string): Promise<Session>;
  listServiceTypes(): Promise<ServiceType[]>;
  listWorkshops(): Promise<Workshop[]>;
  createBooking(input: BookingCreateInput): Promise<Booking>;
  getOrder(id: string): Promise<ServiceOrder>;
  listRecommendations(orderId: string): Promise<Recommendation[]>;
  respondRecommendation(id: string, estado: "aprobado" | "rechazado"): Promise<Recommendation>;
  getHealth(orderId: string): Promise<HealthEntry[]>;
  subscribeOrder(id: string, cb: (o: ServiceOrder) => void): () => void;

  listOrders(): Promise<ServiceOrder[]>;
  createOrder(input: OrderCreateInput): Promise<ServiceOrder>;
  advanceOrder(id: string): Promise<ServiceOrder>;
  addOrderItem(id: string, item: OrderItem): Promise<ServiceOrder>;
  sendApproval(id: string): Promise<ServiceOrder>;
  listBookings(): Promise<Booking[]>;
  listCustomers(): Promise<Customer[]>;
  createCustomer(input: CustomerCreateInput): Promise<Customer>;
}

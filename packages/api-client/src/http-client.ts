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
} from "@smartgarage/contracts";
import type {
  ApiClient,
  OrderCreateInput,
  BookingCreateInput,
  CustomerCreateInput,
} from "./api-client";

export class HttpApiClient implements ApiClient {
  constructor(private baseUrl: string) {}

  private async req<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} en ${path}`);
    return (await res.json()) as T;
  }

  login(email: string, pwd: string) {
    return this.req<Session>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, pwd }),
    });
  }
  listServiceTypes() {
    return this.req<ServiceType[]>("/catalog/service-types");
  }
  listWorkshops() {
    return this.req<Workshop[]>("/workshops");
  }
  createBooking(input: BookingCreateInput) {
    return this.req<Booking>("/bookings", { method: "POST", body: JSON.stringify(input) });
  }
  getOrder(id: string) {
    return this.req<ServiceOrder>(`/orders/${id}`);
  }
  listRecommendations(orderId: string) {
    return this.req<Recommendation[]>(`/orders/${orderId}/recommendations`);
  }
  respondRecommendation(id: string, estado: "aprobado" | "rechazado") {
    return this.req<Recommendation>(`/recommendations/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ estado }),
    });
  }
  getHealth(orderId: string) {
    return this.req<HealthEntry[]>(`/orders/${orderId}/health`);
  }
  subscribeOrder(id: string, cb: (o: ServiceOrder) => void): () => void {
    const es = new EventSource(`${this.baseUrl}/orders/${id}/stream`);
    es.onmessage = (e: MessageEvent) => cb(JSON.parse(e.data));
    return () => es.close();
  }
  listOrders() {
    return this.req<ServiceOrder[]>("/orders");
  }
  createOrder(input: OrderCreateInput) {
    return this.req<ServiceOrder>("/orders", { method: "POST", body: JSON.stringify(input) });
  }
  advanceOrder(id: string) {
    return this.req<ServiceOrder>(`/orders/${id}/advance`, { method: "PATCH" });
  }
  addOrderItem(id: string, item: OrderItem) {
    return this.req<ServiceOrder>(`/orders/${id}/items`, {
      method: "POST",
      body: JSON.stringify(item),
    });
  }
  sendApproval(id: string) {
    return this.req<ServiceOrder>(`/orders/${id}/approval`, { method: "POST" });
  }
  listBookings() {
    return this.req<Booking[]>("/bookings");
  }
  listCustomers() {
    return this.req<Customer[]>("/customers");
  }
  createCustomer(input: CustomerCreateInput) {
    return this.req<Customer>("/customers", { method: "POST", body: JSON.stringify(input) });
  }
}

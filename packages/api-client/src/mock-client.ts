import {
  ORDER_STATES,
  advance,
  sendApproval,
  isValid,
  type Seed,
  type ServiceOrder,
  type OrderItem,
} from "@smartgarage/contracts";
import type {
  ApiClient,
  OrderCreateInput,
  BookingCreateInput,
  CustomerCreateInput,
} from "./api-client";

const delay = (ms = 150) => new Promise<void>((r) => setTimeout(r, ms));

let _id = 100;
const uid = (p: string) => `${p}${_id++}`;

export class MockApiClient implements ApiClient {
  private db: Seed;

  constructor(seed: Seed) {
    this.db = structuredClone(seed);
  }

  async login(email: string, _pwd: string) {
    await delay();
    const role = email.includes("customer") ? "customer" : "owner";
    const found = this.db.sessions.find((s) => s.role === role);
    return { ...(found ?? this.db.sessions[0]!) };
  }

  async listServiceTypes() {
    await delay();
    return structuredClone(this.db.catalog);
  }

  async listWorkshops() {
    await delay();
    return structuredClone(this.db.workshops);
  }

  async createBooking(input: BookingCreateInput) {
    await delay();
    const booking = { id: uid("b"), estado: "programada" as const, ...input };
    this.db.bookings.push(booking);
    return structuredClone(booking);
  }

  async getOrder(id: string) {
    await delay();
    if (id === this.db.trackedOrder.id) return structuredClone(this.db.trackedOrder);
    const order = this.db.orders.find((o) => o.id === id);
    if (!order) throw new Error("Orden no encontrada");
    return structuredClone(order);
  }

  async listRecommendations(orderId: string) {
    await delay();
    return structuredClone(
      this.db.recommendations.filter((r) => r.orderId === orderId),
    );
  }

  async respondRecommendation(id: string, estado: "aprobado" | "rechazado") {
    await delay();
    const rec = this.db.recommendations.find((r) => r.id === id);
    if (!rec) throw new Error("Recomendación no encontrada");
    rec.estado = estado;
    return structuredClone(rec);
  }

  async getHealth(_orderId: string) {
    await delay();
    return structuredClone(this.db.health);
  }

  subscribeOrder(id: string, cb: (o: ServiceOrder) => void): () => void {
    const order =
      id === this.db.trackedOrder.id
        ? this.db.trackedOrder
        : this.db.orders.find((o) => o.id === id);
    if (!order) return () => {};
    let i = ORDER_STATES.indexOf(order.estado);
    const timer = setInterval(() => {
      if (i >= ORDER_STATES.length - 1) {
        clearInterval(timer);
        return;
      }
      i += 1;
      order.estado = ORDER_STATES[i]!;
      if (order.estado === "entregado") order.entregadoAt = new Date().toISOString();
      cb(structuredClone(order));
    }, 5000);
    return () => clearInterval(timer);
  }

  async listOrders() {
    await delay();
    return structuredClone(this.db.orders);
  }

  async createOrder(input: OrderCreateInput) {
    await delay();
    const order: ServiceOrder = {
      ...input,
      id: uid("o"),
      estado: "recibido",
      items: input.items ?? [],
      total: 0,
      recibidoAt: new Date().toISOString(),
      entregadoAt: null,
    };
    this.db.orders.unshift(order);
    return structuredClone(order);
  }

  async advanceOrder(id: string) {
    await delay();
    const order = this.db.orders.find((o) => o.id === id);
    if (!order) throw new Error("Orden no encontrada");
    Object.assign(order, advance(order));
    return structuredClone(order);
  }

  async addOrderItem(id: string, item: OrderItem) {
    await delay();
    if (!isValid.addItem(item)) throw new Error("Ítem inválido");
    const order = this.db.orders.find((o) => o.id === id);
    if (!order) throw new Error("Orden no encontrada");
    order.items = [...order.items, item];
    return structuredClone(order);
  }

  async sendApproval(id: string) {
    await delay();
    const order = this.db.orders.find((o) => o.id === id);
    if (!order) throw new Error("Orden no encontrada");
    Object.assign(order, sendApproval(order));
    return structuredClone(order);
  }

  async listBookings() {
    await delay();
    return structuredClone(this.db.bookings);
  }

  async listCustomers() {
    await delay();
    return structuredClone(this.db.customers);
  }

  async createCustomer(input: CustomerCreateInput) {
    await delay();
    const customer = {
      id: uid("c"),
      tenantId: input.tenantId,
      nombre: input.nombre,
      telefono: input.telefono,
      desde: String(new Date().getFullYear()),
      vehiculos: [
        {
          id: uid("v"),
          placa: input.placa.toUpperCase(),
          marca: input.marca,
          modelo: input.modelo,
          ...(input.anio ? { anio: input.anio } : {}),
        },
      ],
    };
    this.db.customers.push(customer);
    return structuredClone(customer);
  }
}

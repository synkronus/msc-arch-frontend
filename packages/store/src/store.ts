import { create } from "zustand";
import {
  can,
  type Role,
  type Session,
  type ServiceType,
  type Workshop,
  type ServiceOrder,
  type Recommendation,
  type HealthEntry,
  type Booking,
  type Customer,
  type OrderItem,
  type NewBooking,
  type NewOrder,
  type NewCustomer,
} from "@smartgarage/contracts";
import type { ApiClient } from "@smartgarage/api-client";

export interface StoreState {
  session: Session | null;

  catalog: ServiceType[];
  workshops: Workshop[];
  trackedOrder: ServiceOrder | null;
  recommendations: Recommendation[];
  health: HealthEntry[];
  lastBooking: Booking | null;

  orders: ServiceOrder[];
  customers: Customer[];
  bookings: Booking[];

  login(email: string, pwd: string): Promise<Session>;
  logout(): void;
  setRole(role: Role): void;

  loadCatalog(): Promise<void>;
  loadWorkshops(): Promise<void>;
  createBooking(draft: NewBooking): Promise<Booking>;
  trackOrder(id: string): Promise<void>;
  subscribeOrder(id: string): () => void;
  respondRecommendation(id: string, estado: "aprobado" | "rechazado"): Promise<void>;

  loadOrders(): Promise<void>;
  loadCustomers(): Promise<void>;
  loadBookings(): Promise<void>;
  createOrder(draft: NewOrder): Promise<ServiceOrder>;
  createCustomer(draft: NewCustomer): Promise<Customer>;
  addItem(id: string, item: OrderItem): Promise<ServiceOrder>;
  advance(id: string): Promise<ServiceOrder>;
  sendApproval(id: string): Promise<ServiceOrder>;
}

export function createAppStore(api: ApiClient) {
  return create<StoreState>()((set, get) => ({
    session: null,
    catalog: [],
    workshops: [],
    trackedOrder: null,
    recommendations: [],
    health: [],
    lastBooking: null,
    orders: [],
    customers: [],
    bookings: [],

    login: async (email, pwd) => {
      const session = await api.login(email, pwd);
      set({ session });
      return session;
    },
    logout: () => set({ session: null }),
    setRole: (role) =>
      set((s) => (s.session ? { session: { ...s.session, role } } : {})),

    loadCatalog: async () => set({ catalog: await api.listServiceTypes() }),
    loadWorkshops: async () => set({ workshops: await api.listWorkshops() }),
    createBooking: async (draft) => {
      const tenantId = get().session?.tenantId;
      if (!tenantId) throw new Error("Sin sesión");
      const booking = await api.createBooking({ tenantId, ...draft });
      set((s) => ({ lastBooking: booking, bookings: [...s.bookings, booking] }));
      return booking;
    },
    trackOrder: async (id) => {
      const [order, recommendations, health] = await Promise.all([
        api.getOrder(id),
        api.listRecommendations(id),
        api.getHealth(id),
      ]);
      set({ trackedOrder: order, recommendations, health });
    },
    subscribeOrder: (id) =>
      api.subscribeOrder(id, (order) => set({ trackedOrder: order })),
    respondRecommendation: async (id, estado) => {
      const updated = await api.respondRecommendation(id, estado);
      set((s) => ({
        recommendations: s.recommendations.map((r) => (r.id === id ? updated : r)),
      }));
    },

    loadOrders: async () => set({ orders: await api.listOrders() }),
    loadCustomers: async () => set({ customers: await api.listCustomers() }),
    loadBookings: async () => set({ bookings: await api.listBookings() }),
    createOrder: async (draft) => {
      const tenantId = get().session?.tenantId;
      if (!tenantId) throw new Error("Sin sesión");
      const order = await api.createOrder({ tenantId, ...draft });
      set((s) => ({ orders: [order, ...s.orders] }));
      return order;
    },
    createCustomer: async (draft) => {
      const tenantId = get().session?.tenantId;
      if (!tenantId) throw new Error("Sin sesión");
      const customer = await api.createCustomer({ tenantId, ...draft });
      set((s) => ({ customers: [...s.customers, customer] }));
      return customer;
    },
    addItem: async (id, item) => {
      const order = await api.addOrderItem(id, item);
      set((s) => ({ orders: s.orders.map((o) => (o.id === id ? order : o)) }));
      return order;
    },
    advance: async (id) => {
      const role = get().session?.role ?? "customer";
      if (!can(role, "advance")) throw new Error("Rol sin permiso para avanzar");
      const order = await api.advanceOrder(id);
      set((s) => ({ orders: s.orders.map((o) => (o.id === id ? order : o)) }));
      return order;
    },
    sendApproval: async (id) => {
      const role = get().session?.role ?? "customer";
      if (!can(role, "advance")) throw new Error("Rol sin permiso para aprobar");
      const order = await api.sendApproval(id);
      set((s) => ({ orders: s.orders.map((o) => (o.id === id ? order : o)) }));
      return order;
    },
  }));
}

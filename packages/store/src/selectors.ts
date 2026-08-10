import {
  computeKpis,
  type ServiceOrder,
  type Customer,
  type Booking,
  type Kpis,
  type Session,
} from "@smartgarage/contracts";

export const selectTenantOrders = (s: {
  orders: ServiceOrder[];
  session: Session | null;
}): ServiceOrder[] => s.orders.filter((o) => o.tenantId === s.session?.tenantId);

export const selectTenantCustomers = (s: {
  customers: Customer[];
  session: Session | null;
}): Customer[] => s.customers.filter((c) => c.tenantId === s.session?.tenantId);

export const selectTenantBookings = (s: {
  bookings: Booking[];
  session: Session | null;
}): Booking[] => s.bookings.filter((b) => b.tenantId === s.session?.tenantId);

export const selectKpis = (s: { orders: ServiceOrder[]; bookings: Booking[] }): Kpis =>
  computeKpis(s.orders, s.bookings);

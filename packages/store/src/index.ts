import { api } from "@smartgarage/api-client";
import { createAppStore } from "./store";

export const useApp = createAppStore(api);

export { createAppStore } from "./store";
export type { StoreState } from "./store";
export {
  selectTenantOrders,
  selectTenantCustomers,
  selectTenantBookings,
  selectKpis,
} from "./selectors";

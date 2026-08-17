import type { Customer } from "@smartgarage/contracts";
export declare const customerName: (customers: readonly Customer[], id: string) => string;
export declare const vehicleLabel: (customers: readonly Customer[], customerId: string, vehicleId: string) => string;

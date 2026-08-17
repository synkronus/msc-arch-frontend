import { vi, beforeEach, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { useApp } from "@smartgarage/store";

if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

if (!("ResizeObserver" in window)) {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error assigning a stub into the DOM type
  window.ResizeObserver = ResizeObserver;
}

beforeEach(() => {
  useApp.setState({
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
  });
});

afterEach(() => {
  cleanup();
});

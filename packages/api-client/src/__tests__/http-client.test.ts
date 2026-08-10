import { describe, it, expect, vi, afterEach } from "vitest";
import { HttpApiClient } from "../http-client";

type FakeRes = { ok: boolean; status: number; json: () => Promise<unknown> };
type FetchFn = (url: string, init?: RequestInit) => Promise<FakeRes>;

const okJson = (body: unknown): Promise<FakeRes> =>
  Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) });

const res = (over: Partial<FakeRes>): Promise<FakeRes> =>
  Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}), ...over });

describe("HttpApiClient", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("POSTs to /auth/login", async () => {
    const fetchMock = vi.fn<FetchFn>(() =>
      okJson({ userId: "u", tenantId: "t1", role: "owner", token: "t" }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const s = await new HttpApiClient("https://api.test").login("a@b.c", "pw");
    expect(s.role).toBe("owner");
    expect(fetchMock.mock.calls[0]![0]).toBe("https://api.test/auth/login");
    expect(fetchMock.mock.calls[0]![1]).toMatchObject({ method: "POST" });
  });

  it("GETs /orders at the base URL", async () => {
    const fetchMock = vi.fn<FetchFn>(() => okJson([]));
    vi.stubGlobal("fetch", fetchMock);
    await new HttpApiClient("https://api.test").listOrders();
    expect(fetchMock.mock.calls[0]![0]).toBe("https://api.test/orders");
  });

  it("POSTs /orders with the serialized body", async () => {
    const fetchMock = vi.fn<FetchFn>(() => okJson({ id: "o", estado: "recibido" }));
    vi.stubGlobal("fetch", fetchMock);
    await new HttpApiClient("https://api.test").createOrder({
      tenantId: "t1", customerId: "c1", vehicleId: "v1", motivo: "m", canal: "digital",
    });
    expect(fetchMock.mock.calls[0]![0]).toBe("https://api.test/orders");
    expect(fetchMock.mock.calls[0]![1]).toMatchObject({ method: "POST" });
  });

  it("PATCHes /orders/:id/advance", async () => {
    const fetchMock = vi.fn<FetchFn>(() => okJson({ id: "o5", estado: "presupuesto" }));
    vi.stubGlobal("fetch", fetchMock);
    await new HttpApiClient("https://api.test").advanceOrder("o5");
    expect(fetchMock.mock.calls[0]![0]).toBe("https://api.test/orders/o5/advance");
    expect(fetchMock.mock.calls[0]![1]).toMatchObject({ method: "PATCH" });
  });

  it("throws on a non-ok response", async () => {
    vi.stubGlobal("fetch", vi.fn<FetchFn>(() => res({ ok: false, status: 500 })));
    await expect(new HttpApiClient("https://api.test").listOrders()).rejects.toThrow(/HTTP 500/);
  });
});

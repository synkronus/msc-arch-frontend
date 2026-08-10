import { useEffect, useState } from "react";
import { Text, Group, Box } from "@mantine/core";
import { useApp } from "@smartgarage/store";
import { color, ROLE_LABEL } from "@smartgarage/ui";
import type { Role } from "@smartgarage/contracts";
import { Dashboard } from "./features/inicio/Dashboard";
import { AgendaScreen } from "./features/agenda/AgendaScreen";
import { OrdersScreen } from "./features/ordenes/OrdersScreen";
import { OrderDetail } from "./features/ordenes/OrderDetail";
import { ClientsScreen } from "./features/clientes/ClientsScreen";
import { ClientDetail } from "./features/clientes/ClientDetail";
import { NewOrderForm, NewCitaForm, NewClientForm, AddItemForm } from "./features/overlays/Forms";

const ROLES: Role[] = ["receptionist", "technician", "workshop_admin", "owner"];
const TABS = [
  { k: "inicio", label: "Inicio" },
  { k: "agenda", label: "Agenda" },
  { k: "ordenes", label: "Órdenes" },
  { k: "clientes", label: "Clientes" },
] as const;

export type Overlay =
  | { type: "order"; id: string }
  | { type: "client"; id: string }
  | { type: "newOrder" }
  | { type: "newCita" }
  | { type: "newClient" }
  | { type: "addItem"; id: string };

export default function App() {
  const session = useApp((s) => s.session);
  const login = useApp((s) => s.login);
  const setRole = useApp((s) => s.setRole);
  const loadOrders = useApp((s) => s.loadOrders);
  const loadCustomers = useApp((s) => s.loadCustomers);
  const loadBookings = useApp((s) => s.loadBookings);

  const [tab, setTab] = useState<string>("inicio");
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!session) login("owner@smartgarage.dev", "demo");
  }, [session, login]);

  useEffect(() => {
    if (session) {
      loadOrders();
      loadCustomers();
      loadBookings();
    }
  }, [session, loadOrders, loadCustomers, loadBookings]);

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2400);
  };
  const role: Role = session?.role ?? "owner";
  const cycleRole = () => {
    const next = ROLES[(ROLES.indexOf(role) + 1) % ROLES.length] ?? "owner";
    setRole(next);
    flash(`Rol: ${ROLE_LABEL[next]}`);
  };

  return (
    <Box
      style={{
        maxWidth: 480,
        margin: "0 auto",
        minHeight: "100vh",
        background: "#F8FAFC",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        component="header"
        px="md"
        py="sm"
        style={{
          background: color.ink,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Group gap="sm">
          <Text c="white" fw={700}>
            SmartGarage
          </Text>
          <Text c="dimmed" size="xs">
            Gestión de taller
          </Text>
        </Group>
        <button
          onClick={cycleRole}
          style={{
            background: "#1E293B",
            border: "none",
            borderRadius: 999,
            padding: "5px 12px",
            cursor: "pointer",
          }}
        >
          <Text c="white" size="xs" fw={600}>
            {ROLE_LABEL[role]}
          </Text>
        </button>
      </Box>

      <Box component="main" style={{ flex: 1, paddingBottom: 64 }}>
        {tab === "inicio" && <Dashboard />}
        {tab === "agenda" && <AgendaScreen openOverlay={setOverlay} flash={flash} />}
        {tab === "ordenes" && <OrdersScreen openOverlay={setOverlay} />}
        {tab === "clientes" && <ClientsScreen openOverlay={setOverlay} />}
      </Box>

      <Box
        component="nav"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: 480,
          margin: "0 auto",
          height: 64,
          background: "white",
          borderTop: "1px solid #E2E8F0",
          display: "flex",
        }}
      >
        {TABS.map((t) => {
          const active = tab === t.k;
          return (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: active ? color.ink : "#94A3B8",
                fontWeight: active ? 600 : 400,
                fontSize: 11,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </Box>

      {overlay?.type === "order" && (
        <OrderDetail id={overlay.id} onClose={() => setOverlay(null)} openOverlay={setOverlay} flash={flash} />
      )}
      {overlay?.type === "client" && <ClientDetail id={overlay.id} onClose={() => setOverlay(null)} />}
      {overlay?.type === "newOrder" && (
        <NewOrderForm onClose={() => setOverlay(null)} openOverlay={setOverlay} flash={flash} />
      )}
      {overlay?.type === "newCita" && <NewCitaForm onClose={() => setOverlay(null)} flash={flash} />}
      {overlay?.type === "newClient" && <NewClientForm onClose={() => setOverlay(null)} flash={flash} />}
      {overlay?.type === "addItem" && (
        <AddItemForm id={overlay.id} onClose={() => setOverlay(null)} openOverlay={setOverlay} flash={flash} />
      )}

      {toast && (
        <Box
          style={{
            position: "fixed",
            bottom: 80,
            left: "50%",
            transform: "translateX(-50%)",
            background: color.green,
            color: "white",
            padding: "10px 16px",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 500,
            zIndex: 60,
          }}
        >
          {toast}
        </Box>
      )}
    </Box>
  );
}

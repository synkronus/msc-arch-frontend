import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Text, Group, Box } from "@mantine/core";
import { useApp } from "@smartgarage/store";
import { color } from "@smartgarage/ui";
import { CotizarView } from "./features/cotizar/CotizarView";
import { TrackingView } from "./features/seguimiento/TrackingView";

const TABS = [
  { to: "/cotizar", label: "Cotizar" },
  { to: "/seguimiento", label: "Mi carro" },
];

export default function App() {
  const session = useApp((s) => s.session);
  const login = useApp((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!session) login("customer@smartgarage.dev", "demo");
  }, [session, login]);

  useEffect(() => {
    if (location.pathname === "/") navigate("/cotizar");
  }, [location.pathname, navigate]);

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2400);
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
        style={{ background: color.ink, display: "flex", alignItems: "center" }}
      >
        <Group gap="sm">
          <Text c="white" fw={700}>
            SmartGarage
          </Text>
          <Text c="dimmed" size="xs">
            Tu carro, sin sorpresas
          </Text>
        </Group>
      </Box>

      <Box component="main" style={{ flex: 1, paddingBottom: 64 }}>
        <Routes>
          <Route path="/cotizar" element={<CotizarView flash={flash} />} />
          <Route path="/seguimiento" element={<TrackingView flash={flash} />} />
          <Route path="*" element={<CotizarView flash={flash} />} />
        </Routes>
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
          const active = location.pathname.startsWith(t.to);
          return (
            <button
              key={t.to}
              onClick={() => navigate(t.to)}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
            zIndex: 50,
          }}
        >
          {toast}
        </Box>
      )}
    </Box>
  );
}

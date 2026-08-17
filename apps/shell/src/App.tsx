import { useEffect, useState } from "react";
import { AppShell, Badge, Group, Text } from "@mantine/core";
import { useApp } from "@smartgarage/store";
import { ROLE_LABEL } from "@smartgarage/ui";
import { Launcher } from "./Launcher";
import { RemoteMount } from "./RemoteMount";

type View = "launcher" | "cliente" | "taller";

const viewFromPath = (p: string): View =>
  p.startsWith("/cliente") ? "cliente" : p.startsWith("/taller") ? "taller" : "launcher";

const NAV: { view: View; label: string }[] = [
  { view: "cliente", label: "Cliente" },
  { view: "taller", label: "Taller" },
];

const ROADMAP = ["Facturación", "Analítica"];

export default function App() {
  const session = useApp((s) => s.session);
  const logout = useApp((s) => s.logout);
  const [view, setView] = useState<View>(() => viewFromPath(window.location.pathname));

  useEffect(() => {
    const onPop = () => setView(viewFromPath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const go = (v: View) => {
    setView(v);
    const path = v === "launcher" ? "/" : `/${v}`;
    if (window.location.pathname !== path) window.history.pushState({}, "", path);
  };

  return (
    <AppShell header={{ height: 60 }} padding={0}>
      <AppShell.Header>
        <Group h={60} px="md" justify="space-between" wrap="nowrap">
          <Group gap="md" wrap="nowrap">
            <Text fw={700} style={{ cursor: "pointer" }} onClick={() => go("launcher")}>
              SmartGarage
            </Text>
            <Group gap="sm" wrap="nowrap">
              {NAV.map((n) => (
                <Text
                  key={n.view}
                  size="sm"
                  fw={view === n.view ? 700 : 500}
                  c={view === n.view ? "dark" : "dimmed"}
                  style={{ cursor: "pointer" }}
                  onClick={() => go(n.view)}
                >
                  {n.label}
                </Text>
              ))}
              {ROADMAP.map((label) => (
                <Text key={label} size="sm" c="dimmed" style={{ opacity: 0.45 }}>
                  {label}
                </Text>
              ))}
            </Group>
          </Group>
          {session ? (
            <Group gap="sm" wrap="nowrap">
              <Badge variant="light" color="amber">
                {ROLE_LABEL[session.role]}
              </Badge>
              <Text size="xs" c="dimmed">
                {session.tenantId}
              </Text>
              <Text
                size="sm"
                c="dimmed"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  logout();
                  go("launcher");
                }}
              >
                Cambiar sesión
              </Text>
            </Group>
          ) : (
            <Text size="xs" c="dimmed">
              Sin sesión
            </Text>
          )}
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        {view === "launcher" && <Launcher onEnter={(v) => go(v)} />}
        {view === "cliente" && <RemoteMount name="cliente" initialPath="/cotizar" />}
        {view === "taller" && <RemoteMount name="taller" initialPath="/" />}
      </AppShell.Main>
    </AppShell>
  );
}

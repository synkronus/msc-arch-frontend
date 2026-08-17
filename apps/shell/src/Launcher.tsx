import { useState } from "react";
import { Box, Button, Card, Select, Text } from "@mantine/core";
import { useApp } from "@smartgarage/store";
import { ROLE_LABEL } from "@smartgarage/ui";
import type { Role } from "@smartgarage/contracts";

const TALLER_ROLES: readonly Role[] = ["owner", "receptionist", "technician"];

export function Launcher({ onEnter }: { onEnter: (view: "cliente" | "taller") => void }) {
  const login = useApp((s) => s.login);
  const setRole = useApp((s) => s.setRole);
  const [role, setRoleDraft] = useState<string>("owner");
  const [busy, setBusy] = useState(false);

  const entrarCliente = async () => {
    setBusy(true);
    await login("customer@smartgarage.dev", "demo");
    setBusy(false);
    onEnter("cliente");
  };

  const entrarTaller = async () => {
    setBusy(true);
    await login("taller@smartgarage.dev", "demo");
    if (role !== "owner") setRole(role as Role);
    setBusy(false);
    onEnter("taller");
  };

  return (
    <Box maw={420} mx="auto" px="md" py="xl">
      <Text fw={700} size="xl" mb={4}>
        SmartGarage
      </Text>
      <Text size="sm" c="dimmed" mb="lg">
        Elige cómo entrar. La sesión se comparte con las apps montadas.
      </Text>

      <Card withBorder radius="md" p="lg" mb="md">
        <Text fw={600} mb={4}>
          Cliente
        </Text>
        <Text size="sm" c="dimmed" mb="md">
          Cotiza y sigue tu vehículo.
        </Text>
        <Button fullWidth color="amber" size="lg" radius="xl" loading={busy} onClick={entrarCliente}>
          Entrar como Cliente
        </Button>
      </Card>

      <Card withBorder radius="md" p="lg">
        <Text fw={600} mb={4}>
          Taller
        </Text>
        <Text size="sm" c="dimmed" mb="md">
          Gestión: agenda, órdenes y clientes.
        </Text>
        <Select
          label="Rol"
          data={TALLER_ROLES.map((r) => ({ value: r, label: ROLE_LABEL[r] }))}
          value={role}
          onChange={(v) => setRoleDraft(v ?? "owner")}
          mb="md"
        />
        <Button fullWidth color="amber" size="lg" radius="xl" loading={busy} onClick={entrarTaller}>
          Entrar como Taller
        </Button>
      </Card>
    </Box>
  );
}

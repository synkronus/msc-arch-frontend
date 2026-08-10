import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stack,
  TextInput,
  Text,
  Group,
  Card,
  Checkbox,
  Box,
  ThemeIcon,
  Divider,
} from "@mantine/core";
import { PrimaryBtn, Field, StepBar, cop, color } from "@smartgarage/ui";
import { isValid, digits, upper } from "@smartgarage/contracts";
import { useApp } from "@smartgarage/store";

const CAT_LABEL: Record<string, string> = {
  mantenimiento: "Mantenimiento",
  frenos: "Frenos",
  motor: "Motor",
  suspension: "Suspensión",
};

interface VehicleDraft {
  placa: string;
  marca: string;
  linea: string;
  anio: string;
}

export function CotizarView({ flash }: { flash: (m: string) => void }) {
  const catalog = useApp((s) => s.catalog);
  const workshops = useApp((s) => s.workshops);
  const loadCatalog = useApp((s) => s.loadCatalog);
  const loadWorkshops = useApp((s) => s.loadWorkshops);
  const createBooking = useApp((s) => s.createBooking);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [veh, setVeh] = useState<VehicleDraft>({ placa: "", marca: "", linea: "", anio: "" });
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const [pick, setPick] = useState({
    taller: "",
    fecha: "",
    hora: "09:00",
    domicilio: false,
  });

  useEffect(() => {
    loadCatalog();
    loadWorkshops();
  }, [loadCatalog, loadWorkshops]);

  const selItems = useMemo(() => catalog.filter((i) => sel[i.id]), [catalog, sel]);
  const total = selItems.reduce((a, i) => a + i.precio, 0);
  const workshop = workshops.find((w) => w.id === pick.taller);

  const canNext =
    step === 1
      ? isValid.cotizarStep1(veh)
      : step === 2
        ? isValid.cotizarStep2(sel)
        : step === 3
          ? isValid.cotizarStep3(pick)
          : true;

  const confirmar = async () => {
    await createBooking({
      customerId: "c1",
      vehicleId: "v_new",
      servicio: selItems.map((i) => i.nombre).join(", "),
      fecha: pick.fecha,
      hora: pick.hora,
      canal: pick.domicilio ? "digital" : "presencial",
      recordatorio: true,
    });
    flash("Cita agendada · confirmación por WhatsApp");
    navigate("/seguimiento");
  };

  return (
    <Stack gap={0}>
      <StepBar step={step} />
      <Box px="md" py="sm" style={{ minHeight: 360 }}>
        {step === 1 && (
          <Stack gap={0}>
            <Text fw={700} size="lg">
              Tu vehículo
            </Text>
            <Text size="sm" c="dimmed" mb="sm">
              Con estos datos calculamos el precio exacto.
            </Text>
            <Field label="Placa">
              <TextInput
                value={veh.placa}
                onChange={(e) => setVeh({ ...veh, placa: upper(e.target.value) })}
                placeholder="ABC123"
              />
            </Field>
            <Group grow>
              <Field label="Marca">
                <TextInput
                  value={veh.marca}
                  onChange={(e) => setVeh({ ...veh, marca: e.target.value })}
                  placeholder="Chevrolet"
                />
              </Field>
              <Field label="Línea">
                <TextInput
                  value={veh.linea}
                  onChange={(e) => setVeh({ ...veh, linea: e.target.value })}
                  placeholder="Sail"
                />
              </Field>
            </Group>
            <Field label="Año">
              <TextInput
                inputMode="numeric"
                value={veh.anio}
                onChange={(e) => setVeh({ ...veh, anio: digits(e.target.value).slice(0, 4) })}
                placeholder="2018"
              />
            </Field>
          </Stack>
        )}

        {step === 2 && (
          <Stack gap={0}>
            <Text fw={700} size="lg">
              ¿Qué necesita tu carro?
            </Text>
            <Text size="sm" c="dimmed" mb="sm">
              Precios con repuestos de calidad. Sin sorpresas.
            </Text>
            {Object.keys(CAT_LABEL).map((cat) => {
              const items = catalog.filter((c) => c.categoria === cat);
              if (!items.length) return null;
              return (
                <Stack key={cat} gap="xs" mb="sm">
                  <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                    {CAT_LABEL[cat]}
                  </Text>
                  {items.map((it) => {
                    const on = !!sel[it.id];
                    return (
                      <Card
                        key={it.id}
                        withBorder
                        padding="sm"
                        radius="md"
                        onClick={() => setSel({ ...sel, [it.id]: !on })}
                        style={{
                          cursor: "pointer",
                          borderColor: on ? color.amber : undefined,
                          background: on ? "#FFFBEB" : undefined,
                        }}
                      >
                        <Group gap="sm">
                          <ThemeIcon
                            color={on ? "amber" : "gray"}
                            variant={on ? "filled" : "light"}
                            size="md"
                            radius="md"
                          >
                            {on ? "✓" : "+"}
                          </ThemeIcon>
                          <Stack gap={0}>
                            <Text size="sm" fw={600}>
                              {it.nombre}
                            </Text>
                            <Text size="xs" c="dimmed">
                              Desde {cop(it.precio)}
                            </Text>
                          </Stack>
                        </Group>
                      </Card>
                    );
                  })}
                </Stack>
              );
            })}
          </Stack>
        )}

        {step === 3 && (
          <Stack gap={0}>
            <Text fw={700} size="lg">
              Elige taller y horario
            </Text>
            <Text size="sm" c="dimmed" mb="sm">
              Talleres aliados verificados cerca de ti.
            </Text>
            {workshops.map((w) => {
              const on = pick.taller === w.id;
              return (
                <Card
                  key={w.id}
                  withBorder
                  padding="sm"
                  radius="md"
                  mb="xs"
                  onClick={() => setPick({ ...pick, taller: w.id })}
                  style={{
                    cursor: "pointer",
                    borderColor: on ? color.amber : undefined,
                    background: on ? "#FFFBEB" : undefined,
                  }}
                >
                  <Group justify="space-between">
                    <Stack gap={0}>
                      <Text size="sm" fw={600}>
                        {w.nombre}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {w.zona} · {w.km} km · ★ {w.rating}
                      </Text>
                    </Stack>
                  </Group>
                </Card>
              );
            })}
            <Group grow>
              <Field label="Fecha">
                <TextInput
                  type="date"
                  value={pick.fecha}
                  onChange={(e) => setPick({ ...pick, fecha: e.target.value })}
                />
              </Field>
              <Field label="Hora">
                <TextInput
                  type="time"
                  value={pick.hora}
                  onChange={(e) => setPick({ ...pick, hora: e.target.value })}
                />
              </Field>
            </Group>
            <Checkbox
              checked={pick.domicilio}
              onChange={(e) => setPick({ ...pick, domicilio: e.currentTarget.checked })}
              label="Recoger a domicilio (pasamos por tu carro)"
              mt="sm"
            />
          </Stack>
        )}

        {step === 4 && (
          <Stack gap={0}>
            <Text fw={700} size="lg">
              Tu cotización
            </Text>
            <Text size="sm" c="dimmed" mb="sm">
              Revisa y confirma. El precio es final.
            </Text>
            <Card withBorder padding="md" radius="md" mb="sm">
              <Text fw={600} mb="xs">
                {veh.marca} {veh.linea} {veh.anio} · {veh.placa}
              </Text>
              <Divider mb="sm" />
              {selItems.map((i) => (
                <Group key={i.id} justify="space-between" mb={4}>
                  <Text size="sm" c="dimmed">
                    {i.nombre}
                  </Text>
                  <Text size="sm" fw={600}>
                    {cop(i.precio)}
                  </Text>
                </Group>
              ))}
              <Divider my="sm" />
              <Group justify="space-between">
                <Text fw={700}>Total estimado</Text>
                <Text fw={700} size="lg" style={{ color: color.amberD }}>
                  {cop(total)}
                </Text>
              </Group>
            </Card>
            {workshop && (
              <Card withBorder padding="md" radius="md">
                <Text size="sm" fw={600}>
                  {workshop.nombre} · {workshop.zona}
                </Text>
                <Text size="xs" c="dimmed">
                  {pick.fecha} · {pick.hora}
                  {pick.domicilio && " · Recogida a domicilio"}
                </Text>
              </Card>
            )}
          </Stack>
        )}
      </Box>

      <Box
        p="md"
        style={{ borderTop: "1px solid #E2E8F0", background: "white" }}
      >
        {step === 2 && total > 0 && (
          <Group justify="space-between" mb="sm">
            <Text size="sm" c="dimmed">
              {selItems.length} servicio(s)
            </Text>
            <Text fw={700}>{cop(total)}</Text>
          </Group>
        )}
        <Group grow>
          {step > 1 && (
            <PrimaryBtn variant="subtle" color="gray" onClick={() => setStep(step - 1)}>
              Atrás
            </PrimaryBtn>
          )}
          {step < 4 ? (
            <PrimaryBtn disabled={!canNext} onClick={() => canNext && setStep(step + 1)}>
              Continuar
            </PrimaryBtn>
          ) : (
            <PrimaryBtn onClick={confirmar}>Confirmar y agendar</PrimaryBtn>
          )}
        </Group>
      </Box>
    </Stack>
  );
}

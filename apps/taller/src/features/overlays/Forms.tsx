import { useState } from "react";
import { Box, Text, TextInput, Select, Checkbox } from "@mantine/core";
import { useApp, selectTenantCustomers } from "@smartgarage/store";
import { Sheet, PrimaryBtn, Field } from "@smartgarage/ui";
import { isValid, digits, upper, type Channel } from "@smartgarage/contracts";
import type { Overlay } from "../../App";

function ClientVehiclePicker({
  value,
  onChange,
}: {
  value: { clienteId: string; vehiculoId: string };
  onChange: (next: { clienteId: string; vehiculoId: string }) => void;
}) {
  const customers = useApp(selectTenantCustomers);
  const cli = customers.find((c) => c.id === value.clienteId);
  return (
    <>
      <Field label="Cliente">
        <Select
          data={customers.map((c) => ({ value: c.id, label: c.nombre }))}
          value={value.clienteId}
          onChange={(v) => {
            const c = customers.find((x) => x.id === v);
            onChange({ clienteId: v ?? "", vehiculoId: c?.vehiculos[0]?.id ?? "" });
          }}
          placeholder="Selecciona…"
          searchable
        />
      </Field>
      {value.clienteId && cli && (
        <Field label="Vehículo">
          <Select
            data={cli.vehiculos.map((v) => ({ value: v.id, label: `${v.marca} ${v.modelo} · ${v.placa}` }))}
            value={value.vehiculoId}
            onChange={(v) => onChange({ ...value, vehiculoId: v ?? "" })}
          />
        </Field>
      )}
    </>
  );
}

export function NewOrderForm({
  onClose,
  openOverlay,
  flash,
}: {
  onClose: () => void;
  openOverlay: (o: Overlay) => void;
  flash: (m: string) => void;
}) {
  const createOrder = useApp((s) => s.createOrder);
  const [f, setF] = useState<{ clienteId: string; vehiculoId: string; motivo: string; canal: Channel }>({
    clienteId: "",
    vehiculoId: "",
    motivo: "",
    canal: "presencial",
  });

  const submit = async () => {
    const o = await createOrder({
      customerId: f.clienteId,
      vehicleId: f.vehiculoId,
      motivo: f.motivo,
      canal: f.canal,
    });
    flash("Orden de servicio abierta");
    openOverlay({ type: "order", id: o.id });
  };

  return (
    <Sheet title="Nueva orden" opened onClose={onClose}>
      <Box px="md" py="md">
        <ClientVehiclePicker value={f} onChange={(v) => setF({ ...f, ...v })} />
        <Field label="Motivo de ingreso">
          <TextInput
            value={f.motivo}
            onChange={(e) => setF({ ...f, motivo: e.target.value })}
            placeholder="Ruido en frenos, mantenimiento…"
          />
        </Field>
        <PrimaryBtn disabled={!isValid.newOrder(f)} onClick={submit}>
          Recibir vehículo
        </PrimaryBtn>
      </Box>
    </Sheet>
  );
}

export function NewCitaForm({
  onClose,
  flash,
}: {
  onClose: () => void;
  flash: (m: string) => void;
}) {
  const createBooking = useApp((s) => s.createBooking);
  const [f, setF] = useState({
    clienteId: "",
    vehiculoId: "",
    servicio: "",
    fecha: "",
    hora: "09:00",
    canal: "digital" as "digital" | "presencial",
    recordatorio: true,
  });

  const submit = async () => {
    await createBooking({
      customerId: f.clienteId,
      vehicleId: f.vehiculoId,
      servicio: f.servicio,
      fecha: f.fecha,
      hora: f.hora,
      canal: f.canal,
      recordatorio: f.recordatorio,
    });
    flash(f.canal === "digital" ? "Cita creada · recordatorio por WhatsApp" : "Cita creada");
    onClose();
  };

  return (
    <Sheet title="Nueva cita" opened onClose={onClose}>
      <Box px="md" py="md">
        <ClientVehiclePicker value={f} onChange={(v) => setF({ ...f, ...v })} />
        <Field label="Servicio">
          <TextInput value={f.servicio} onChange={(e) => setF({ ...f, servicio: e.target.value })} placeholder="Cambio de aceite" />
        </Field>
        <Field label="Fecha">
          <TextInput type="date" value={f.fecha} onChange={(e) => setF({ ...f, fecha: e.target.value })} />
        </Field>
        <Field label="Hora">
          <TextInput type="time" value={f.hora} onChange={(e) => setF({ ...f, hora: e.target.value })} />
        </Field>
        <Field label="¿Cómo se agendó?">
          <Select
            data={[
              { value: "digital", label: "WhatsApp / App" },
              { value: "presencial", label: "Teléfono / Presencial" },
            ]}
            value={f.canal}
            onChange={(v) => setF({ ...f, canal: (v ?? "digital") as "digital" | "presencial" })}
          />
        </Field>
        <Checkbox
          checked={f.recordatorio}
          onChange={(e) => setF({ ...f, recordatorio: e.currentTarget.checked })}
          label="Enviar recordatorio automático"
          mb="md"
        />
        <PrimaryBtn disabled={!isValid.newCita(f)} onClick={submit}>
          Crear cita
        </PrimaryBtn>
      </Box>
    </Sheet>
  );
}

export function AddItemForm({
  id,
  onClose,
  openOverlay,
  flash,
}: {
  id: string;
  onClose: () => void;
  openOverlay: (o: Overlay) => void;
  flash: (m: string) => void;
}) {
  const addItem = useApp((s) => s.addItem);
  const [f, setF] = useState({ desc: "", tipo: "mano_de_obra" as "mano_de_obra" | "repuesto", valor: "" });

  const submit = async () => {
    try {
      await addItem(id, { desc: f.desc, tipo: f.tipo, valor: Number(f.valor) });
      flash("Ítem agregado");
      openOverlay({ type: "order", id });
    } catch (e) {
      flash((e as Error).message);
    }
  };

  return (
    <Sheet title="Agregar al presupuesto" opened onClose={() => openOverlay({ type: "order", id })}>
      <Box px="md" py="md">
        <Field label="Descripción">
          <TextInput value={f.desc} onChange={(e) => setF({ ...f, desc: e.target.value })} placeholder="Pastillas de freno" />
        </Field>
        <Field label="Tipo">
          <Select
            data={[
              { value: "mano_de_obra", label: "Mano de obra" },
              { value: "repuesto", label: "Repuesto" },
            ]}
            value={f.tipo}
            onChange={(v) => setF({ ...f, tipo: (v ?? "mano_de_obra") as "mano_de_obra" | "repuesto" })}
          />
        </Field>
        <Field label="Valor (COP)">
          <TextInput
            inputMode="numeric"
            value={f.valor}
            onChange={(e) => setF({ ...f, valor: digits(e.target.value) })}
            placeholder="120000"
          />
        </Field>
        <PrimaryBtn disabled={!isValid.addItem(f)} onClick={submit}>
          Agregar ítem
        </PrimaryBtn>
      </Box>
    </Sheet>
  );
}

export function NewClientForm({
  onClose,
  flash,
}: {
  onClose: () => void;
  flash: (m: string) => void;
}) {
  const createCustomer = useApp((s) => s.createCustomer);
  const [f, setF] = useState({ nombre: "", telefono: "", placa: "", marca: "", modelo: "" });

  const submit = async () => {
    await createCustomer({
      nombre: f.nombre,
      telefono: f.telefono,
      placa: upper(f.placa),
      marca: f.marca,
      modelo: f.modelo,
    });
    flash("Cliente guardado");
    onClose();
  };

  return (
    <Sheet title="Nuevo cliente" opened onClose={onClose}>
      <Box px="md" py="md">
        <Field label="Nombre completo">
          <TextInput value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} placeholder="Ej. Carlos Mejía" />
        </Field>
        <Field label="Teléfono / WhatsApp">
          <TextInput value={f.telefono} onChange={(e) => setF({ ...f, telefono: e.target.value })} placeholder="300 000 0000" />
        </Field>
        <Text size="sm" fw={600} c="dimmed" mb="xs" mt="sm">
          Vehículo
        </Text>
        <Field label="Placa">
          <TextInput value={f.placa} onChange={(e) => setF({ ...f, placa: upper(e.target.value) })} placeholder="ABC123" />
        </Field>
        <Field label="Marca">
          <TextInput value={f.marca} onChange={(e) => setF({ ...f, marca: e.target.value })} placeholder="Chevrolet" />
        </Field>
        <Field label="Modelo">
          <TextInput value={f.modelo} onChange={(e) => setF({ ...f, modelo: e.target.value })} placeholder="Sail 2018" />
        </Field>
        <PrimaryBtn disabled={!isValid.newClient(f)} onClick={submit}>
          Guardar cliente
        </PrimaryBtn>
      </Box>
    </Sheet>
  );
}

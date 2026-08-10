export const isValid = {
  cotizarStep1: (v: { placa: string; marca: string; anio: string }) =>
    [v.placa, v.marca, v.anio].every(Boolean),
  cotizarStep2: (sel: Record<string, boolean>) =>
    Object.values(sel).some(Boolean),
  cotizarStep3: (v: { taller: string; fecha: string; hora: string }) =>
    [v.taller, v.fecha, v.hora].every(Boolean),
  newOrder: (v: { clienteId: string; vehiculoId: string; motivo: string }) =>
    [v.clienteId, v.vehiculoId, v.motivo].every(Boolean),
  newCita: (v: {
    clienteId: string; vehiculoId: string; servicio: string; fecha: string; hora: string;
  }) => [v.clienteId, v.vehiculoId, v.servicio, v.fecha, v.hora].every(Boolean),
  addItem: (v: { desc: string; valor: number | string }) =>
    [v.desc, Number(v.valor) > 0].every(Boolean),
  newClient: (v: {
    nombre: string; telefono: string; placa: string; marca: string; modelo: string;
  }) => [v.nombre, v.telefono, v.placa, v.marca, v.modelo].every(Boolean),
} as const;

export const digits = (s: string): string => s.replace(/\D/g, "");

export const upper = (s: string): string => s.toUpperCase();

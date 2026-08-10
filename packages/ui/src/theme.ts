import { createTheme, type MantineColorsTuple } from "@mantine/core";

const amber: MantineColorsTuple = [
  "#FFF7ED", "#FEF3C7", "#FDE68A", "#FCD34D", "#FBBF24",
  "#F59E0B", "#D97706", "#B45309", "#92400E", "#78350F",
];

const green: MantineColorsTuple = [
  "#F0FDF4", "#DCFCE7", "#BBF7D0", "#86EFAC", "#4ADE80",
  "#22C55E", "#16A34A", "#15803D", "#166534", "#14532D",
];

const red: MantineColorsTuple = [
  "#FEF2F2", "#FEE2E2", "#FECACA", "#FCA5A5", "#F87171",
  "#EF4444", "#DC2626", "#B91C1C", "#991B1B", "#7F1D1D",
];

const blue: MantineColorsTuple = [
  "#EFF6FF", "#DBEAFE", "#BFDBFE", "#93C5FD", "#60A5FA",
  "#3B82F6", "#2563EB", "#1D4ED8", "#1E40AF", "#1E3A8A",
];

const slate: MantineColorsTuple = [
  "#F8FAFC", "#F1F5F9", "#E2E8F0", "#CBD5E1", "#94A3B8",
  "#64748B", "#475569", "#334155", "#1E293B", "#0F172A",
];

export const theme = createTheme({
  primaryColor: "amber",
  colors: { amber, green, red, blue, slate },
  fontFamily:
    "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
  radius: {
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
  },
  defaultRadius: "md",
});

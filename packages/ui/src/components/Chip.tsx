import { Badge } from "@mantine/core";
import type { OrderState } from "@smartgarage/contracts";
import { STATUS_BADGE_COLOR, STATUS_LABEL } from "../tokens";

export function Chip({ estado }: { estado: OrderState }) {
  return (
    <Badge color={STATUS_BADGE_COLOR[estado]} variant="light" size="md">
      {STATUS_LABEL[estado]}
    </Badge>
  );
}

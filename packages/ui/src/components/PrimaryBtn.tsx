import { Button } from "@mantine/core";
import type { ReactNode, MouseEventHandler } from "react";

export interface PrimaryBtnProps {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  variant?: "filled" | "light" | "subtle" | "outline" | "default" | "transparent" | "white";
  color?: string;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}

export function PrimaryBtn({ children, ...rest }: PrimaryBtnProps) {
  return (
    <Button fullWidth size="lg" radius="xl" color="amber" {...rest}>
      {children}
    </Button>
  );
}

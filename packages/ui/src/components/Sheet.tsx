import { Modal } from "@mantine/core";
import type { ReactNode } from "react";

export function Sheet({
  title,
  opened,
  onClose,
  children,
}: {
  title: string;
  opened: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} fullScreen radius={0}>
      {children}
    </Modal>
  );
}

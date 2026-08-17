import type { Overlay } from "../../App";
export declare function OrderDetail({ id, onClose, openOverlay, flash, }: {
    id: string;
    onClose: () => void;
    openOverlay: (o: Overlay) => void;
    flash: (m: string) => void;
}): import("react").JSX.Element | null;

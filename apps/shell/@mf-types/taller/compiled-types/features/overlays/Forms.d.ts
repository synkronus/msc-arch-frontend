import type { Overlay } from "../../App";
export declare function NewOrderForm({ onClose, openOverlay, flash, }: {
    onClose: () => void;
    openOverlay: (o: Overlay) => void;
    flash: (m: string) => void;
}): import("react").JSX.Element;
export declare function NewCitaForm({ onClose, flash, }: {
    onClose: () => void;
    flash: (m: string) => void;
}): import("react").JSX.Element;
export declare function AddItemForm({ id, onClose, openOverlay, flash, }: {
    id: string;
    onClose: () => void;
    openOverlay: (o: Overlay) => void;
    flash: (m: string) => void;
}): import("react").JSX.Element;
export declare function NewClientForm({ onClose, flash, }: {
    onClose: () => void;
    flash: (m: string) => void;
}): import("react").JSX.Element;

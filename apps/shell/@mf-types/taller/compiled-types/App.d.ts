export type Overlay = {
    type: "order";
    id: string;
} | {
    type: "client";
    id: string;
} | {
    type: "newOrder";
} | {
    type: "newCita";
} | {
    type: "newClient";
} | {
    type: "addItem";
    id: string;
};
export default function App(): import("react").JSX.Element;

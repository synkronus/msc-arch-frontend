import React from "react";
import ReactDOM from "react-dom/client";
import "@mantine/core/styles.css";
import { SmartGarageProvider } from "@smartgarage/ui";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SmartGarageProvider>
      <App />
    </SmartGarageProvider>
  </React.StrictMode>,
);

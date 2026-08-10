import React from "react";
import ReactDOM from "react-dom/client";
import "@mantine/core/styles.css";
import { BrowserRouter } from "react-router-dom";
import { SmartGarageProvider } from "@smartgarage/ui";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SmartGarageProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </SmartGarageProvider>
  </React.StrictMode>,
);

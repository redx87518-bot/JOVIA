import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/lib/store-context";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <App />
        <Toaster richColors closeButton />
      </BrowserRouter>
    </StoreProvider>
  </React.StrictMode>
);

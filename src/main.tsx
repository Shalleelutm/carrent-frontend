import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./lib/auth-context";
import { CurrencyProvider } from "./lib/currency-context";

import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CurrencyProvider>
          <BrowserRouter>

            {/* Your App */}
            <App />

            {/* Global Toast System */}
            <Toaster position="top-right" />

          </BrowserRouter>
        </CurrencyProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
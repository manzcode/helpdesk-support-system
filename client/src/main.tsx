import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { TicketsProvider } from "./context/TicketsContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <TicketsProvider>
          <App />
        </TicketsProvider>
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>
);

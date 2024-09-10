import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { UserAuthProvider } from "./context/UserContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserAuthProvider>
    <NextUIProvider>
      <App />
    </NextUIProvider>
    </UserAuthProvider>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { UserAuthProvider } from "./context/UserContext";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import "../../../node_modules/slick-carousel/slick/slick.css";
import "../../../node_modules/slick-carousel/slick/slick-theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <UserAuthProvider>
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <App />
      </NextThemesProvider>
    </NextUIProvider>
  </UserAuthProvider>
  // </React.StrictMode>
);

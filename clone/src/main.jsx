import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import MainRoutes from "./MainRoutes.jsx";
import { store } from "./store/store.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <MainRoutes />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

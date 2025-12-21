import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";

import { Provider as ReduxProvider } from "react-redux";
import { store } from "./redux/store.ts";
import { router } from "./routes/index.tsx";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <Toaster position="top-center" reverseOrder={false} />

      <RouterProvider router={router} />


    </ReduxProvider>
  </React.StrictMode>
);
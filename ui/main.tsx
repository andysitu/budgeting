import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// latin-only, matching the `subsets: ["latin"]` next/font used
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-700.css";
import "./app/globals.css";

import RootLayout from "./app/layout";
import Home from "./app/page";
import Login from "./app/login/page";
import UrlLibrary from "./app/library/UrlLibrary";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: UrlLibrary.HOME, element: <Home /> },
      { path: UrlLibrary.LOGIN, element: <Login /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

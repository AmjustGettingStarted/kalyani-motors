import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes";
import { KalyaniProvider } from "./context/KalyaniContext";
import { HeaderProvider } from "./context/HeaderContext";

export default function App() {
  return (
    <KalyaniProvider>
      <HeaderProvider>
        <RouterProvider router={router} />
      </HeaderProvider>
    </KalyaniProvider>
  );
}

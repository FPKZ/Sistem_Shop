import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./imports.jsx";
import { Cadastro, Clientes, Produtos, Notas } from "./Router.jsx";
import Layout from "./components/layout/Layout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: "cadastro", element: <Cadastro /> },
      { path: "clientes", element: <Clientes /> },
      { path: "/produtos", element: <Produtos /> },
      { path: "notas", element: <Notas /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./imports.jsx";
import {
  Cadastro,
  Clientes,
  Produtos,
  Notas,
  Vendas,
  NovaVenda,
  TelaVendas,
  Extorno,
  Devolucao,
  CadastroCliente,
  CadastroNota,
  CadastroProduto,
  TelaCadastro,
  Login
} from "./Router.jsx";
import Layout from "./components/layout/Layout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: "cadastro", element: <Cadastro />,
        children: [
          { index: true, element: <TelaCadastro /> },
          { path: "produto", element: <CadastroProduto /> },
          { path: "nota", element: <CadastroNota /> },
          { path: "cliente", element: <CadastroCliente /> },
        ]
       },
      { path: "clientes", element: <Clientes /> },
      { path: "produtos", element: <Produtos /> },
      { path: "notas", element: <Notas /> },
      {
        path: "vendas",
        element: <Vendas />,
        children: [
          { index: true, element: <TelaVendas /> },
          { path: "Nova-Venda", element: <NovaVenda /> },
          { path: "Extorno", element: <Extorno /> },
          { path: "Devolucao", element: <Devolucao /> },
        ],
      },
    ],
  },
  { path: "login", element: <Login />}
]);


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

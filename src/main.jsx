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
  Login,
  CadastroUser,
  PerfilPage,
  GerenciamentoUsuario,
  Catalogo,
} from "./Router.jsx";
import Layout from "./components/layout/Layout.jsx";
import ProtectedRoute from "./auth/sistem/ProtectedRoute.jsx";
import { AuthProvider } from "./auth/sistem/AuthContext.jsx";
import ToastProvider from "./contexts/ToastContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minuto
      refetchOnWindowFocus: false, // Evita picos de rede/processamento ao voltar para a aba
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <App /> },
          {
            path: "cadastro",
            element: <Cadastro />,
            children: [
              { index: true, element: <TelaCadastro /> },
              { path: "produto", element: <CadastroProduto /> },
              { path: "nota", element: <CadastroNota /> },
              { path: "cliente", element: <CadastroCliente /> },
            ],
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
          { path: "perfil", element: <PerfilPage /> },
          { path: "usuarios", element: <GerenciamentoUsuario /> },
        ],
      },
    ],
  },
  { path: "login", element: <Login /> },
  { path: "cadastro-user", element: <CadastroUser /> },
  { path: "catalogo", element: <Catalogo /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
);

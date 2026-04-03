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
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 horas - Tempo para manter os dados no LocalStorage
      staleTime: 60000, // 1 minuto
      refetchOnWindowFocus: false, // Evita picos de rede/processamento ao voltar para a aba
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

const blobUrl = import.meta.env.VITE_BLOB_CACHE_URL;

function prefetchBlobCache() {
  if (!blobUrl) return;
  fetch(blobUrl, { cache: "no-store" }) // Impede cache velho do navegador no blob
    .then(res => res.ok ? res.json() : null)
    .then(cache => {
      if (!cache) return;
      if (cache.catalogo) queryClient.setQueryData(["catalogo"], cache.catalogo);
      if (cache.categorias) queryClient.setQueryData(["categorias"], cache.categorias);
      if (cache.notas) queryClient.setQueryData(["notas"], cache.notas);
      if (cache.produtos) queryClient.setQueryData(["produtos"], cache.produtos);
      if (cache.cores) queryClient.setQueryData(["cores"], cache.cores);
      
      console.log("[CACHE] TanStack Query hidratado via Vercel Blob");
    })
    .catch(e => console.error("[CACHE] Falha ao hidratar do Vercel Blob:", e));
}

prefetchBlobCache();

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
        <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
          <RouterProvider router={router} />
        </PersistQueryClientProvider>
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
);

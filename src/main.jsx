import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./imports.jsx";
import router from "./Router.jsx";
import LoadingPage from "./auth/sistem/LoadingPage.jsx";
import { AuthProvider } from "./auth/sistem/AuthContext.jsx";
import ToastProvider from "./contexts/ToastContext.jsx";
import ModalProvider from "./contexts/ModalContext.jsx";
import GlobalError from "./pages/erros/GlobalError.jsx";
import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      // Ignora requisições canceladas pelo usuário ou revalidações invisíveis
      if (error?.message === "canceled") return;
      window.dispatchEvent(new CustomEvent("global:toast", { detail: { type: "error", message: `Erro ao carregar dados: ${error.message}` } }));
    }
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      window.dispatchEvent(new CustomEvent("global:toast", { detail: { type: "error", message: `Erro na operação: ${error.message}` } }));
    }
  }),
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



createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <ModalProvider>
          <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
            {/* 
              O <Suspense> trabalha em conjunto com o React.lazy() do Router.jsx.
              Sempre que o usuário navegar para uma rota em que o arquivo JS (chunk) 
              ainda não foi baixado, o React suspende a renderização e exibe o "fallback" 
              (no nosso caso, a LoadingPage). Quando o download terminar, ele exibe a página.
            */}
            <Suspense fallback={<LoadingPage />}>
              <RouterProvider router={router} />
            </Suspense>
          </PersistQueryClientProvider>
        </ModalProvider>
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
);

import { useRouteError, useNavigate } from "react-router-dom";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function GlobalError() {
  const error = useRouteError();
  const navigate = useNavigate();

  // Se for erro de falha ao importar módulo (chunk loss do lazy loading)
  const isChunkError = error?.message?.includes("Failed to fetch dynamically imported module") || 
                       error?.message?.includes("Importing a module script failed");

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="text-center p-5 shadow bg-white rounded-4" style={{ maxWidth: "500px", width: "90%" }}>
        <div className="mb-4 text-roxo">
          <AlertTriangle size={64} className="mx-auto" />
        </div>
        
        <h2 className="mb-3 fw-bold text-dark">Oops! Algo deu errado.</h2>
        
        <p className="text-muted mb-4 fs-6">
          {isChunkError 
            ? "Tivemos um problema ao carregar esta página. Pode ser uma pequena falha de conexão. Tente novamente!"
            : "Um erro inesperado ocorreu na renderização da tela. Desculpe pelo transtorno."}
        </p>

        {/* Detalhes do erro no ambiente local (facilita o debug) */}
        {import.meta.env.DEV && !isChunkError && (
          <div className="bg-light border p-3 rounded text-start overflow-auto mb-4" style={{ maxHeight: "150px", fontSize: "0.8rem" }}>
            <span className="text-danger fw-bold">{error?.statusText || error?.message}</span>
            <br />
            <pre className="text-muted mt-2">{error?.stack}</pre>
          </div>
        )}

        <div className="d-flex flex-column gap-3">
          <button 
            className="btn btn-roxo w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={18} />
            Recarregar Página
          </button>
          
          <button 
            className="btn btn-outline-secondary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
            onClick={() => navigate("/")}
          >
            <Home size={18} />
            Voltar ao Início
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useFiltroOrdenacao } from "@hooks/useFiltroOrdenacao";
import { usePagination } from "@hooks/usePagination";
import { ProdutoHeader } from "./ProdutoHeader";
import { ProdutoGrid } from "./ProdutoGrid";
import { ProdutoList } from "./ProdutoList";
import { Pagination } from "react-bootstrap";

function Produto({ produtos, setModalInfoProduto, setProduto, children }) {
  const [viewMode, setViewMode] = useState("grid"); // "grid" ou "list"

  const camposFiltragem = [
    "nome",
    "categoria.nome",
    { path: "itemEstoque", subCampos: ["marca"] },
  ];

  const { filtro, setFiltro, order, dadosProcessados, requisitarOrdenacao } =
    useFiltroOrdenacao(produtos, camposFiltragem);

  const {
    currentItems,
    currentPage,
    totalPages,
    handlePageChange,
  } = usePagination(dadosProcessados, 15);

  // Extrai categorias únicas dos produtos para o filtro
  const categoriasUnicas = Array.from(
    new Set(
      produtos.filter((p) => p.categoria?.nome).map((p) => p.categoria.nome),
    ),
  );

  if (!produtos || produtos.length === 0)
    return (
      <div className="alert alert-roxo mt-4" role="alert">
        Nenhum produto cadastrado!
      </div>
    );

  const getEstoqueBadge = (estoque) => {
    const quantidade = estoque || 0;
    if (quantidade >= 10) {
      return <span className="badge bg-success">Estoque Alto</span>;
    } else if (quantidade >= 5) {
      return <span className="badge bg-warning text-dark">Estoque Médio</span>;
    } else if (quantidade > 0) {
      return <span className="badge bg-danger">Estoque Baixo</span>;
    } else {
      return <span className="badge bg-secondary">Fora de Estoque</span>;
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      <ProdutoHeader
        filtro={filtro}
        setFiltro={setFiltro}
        order={order}
        requisitarOrdenacao={requisitarOrdenacao}
        categoriasUnicas={categoriasUnicas}
        viewMode={viewMode}
        setViewMode={setViewMode}
      >
        {children}
      </ProdutoHeader>

      <div className="grow overflow-auto custom-scrollbar px-1">
        {viewMode === "grid" ? (
          <ProdutoGrid
            dadosProcessados={currentItems}
            setModalInfoProduto={setModalInfoProduto}
            setProduto={setProduto}
            getEstoqueBadge={getEstoqueBadge}
          />
        ) : (
          <ProdutoList
            dadosProcessados={currentItems}
            setModalInfoProduto={setModalInfoProduto}
            setProduto={setProduto}
            getEstoqueBadge={getEstoqueBadge}
          />
        )}
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination className="pagination-roxo">
            <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
            {[...Array(totalPages)].map((_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === currentPage}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
          </Pagination>
        </div>
      )}
    </div>
  );
}

export default Produto;

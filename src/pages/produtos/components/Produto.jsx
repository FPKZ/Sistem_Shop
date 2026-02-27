import { useState } from "react";
import { useFiltroOrdenacao } from "@hooks/useFiltroOrdenacao";
import { ProdutoHeader } from "./ProdutoHeader";
import { ProdutoGrid } from "./ProdutoGrid";
import { ProdutoList } from "./ProdutoList";

function Produto({ produtos, setModalInfoProduto, setProduto, children }) {
  const [viewMode, setViewMode] = useState("grid"); // "grid" ou "list"

  const camposFiltragem = [
    "nome",
    "categoria.nome",
    { path: "itemEstoque", subCampos: ["marca"] },
  ];

  const { filtro, setFiltro, order, dadosProcessados, requisitarOrdenacao } =
    useFiltroOrdenacao(produtos, camposFiltragem);

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
    <>
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

      {viewMode === "grid" ? (
        <ProdutoGrid
          dadosProcessados={dadosProcessados}
          setModalInfoProduto={setModalInfoProduto}
          setProduto={setProduto}
          getEstoqueBadge={getEstoqueBadge}
        />
      ) : (
        <ProdutoList
          dadosProcessados={dadosProcessados}
          setModalInfoProduto={setModalInfoProduto}
          setProduto={setProduto}
          getEstoqueBadge={getEstoqueBadge}
        />
      )}
    </>
  );
}

export default Produto;

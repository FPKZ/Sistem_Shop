import React from "react";
import util from "@services/utils.js";

export const ProdutoList = React.memo(({
  dadosProcessados,
  setModalInfoProduto,
  setProduto,
  getEstoqueBadge,
}) => {
  return (
    <div className="table-responsive bg-white rounded shadow-sm mb-4">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Produto</th>
            <th>Categoria</th>
            <th>Descrição</th>
            <th className="text-center">Quantidade</th>
            <th className="text-center">Status Estoque</th>
          </tr>
        </thead>
        <tbody>
          {dadosProcessados.map((produto) => (
            <tr
              key={produto.id}
              onClick={() => {
                setModalInfoProduto(true);
                setProduto(produto);
              }}
              style={{ cursor: "pointer" }}
            >
              <td>{produto.id}</td>
              <td>
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={Array.isArray(produto.imgs) ? produto.imgs[0] : produto.imagem || "assets/tube-spinner.svg"}
                    alt={produto.nome}
                    className="rounded object-fit-contain bg-light"
                    style={{ width: "40px", height: "40px" }}
                  />
                  <span className="fw-bold">{produto.nome}</span>
                </div>
              </td>
              <td>{produto.categoria?.nome || "-"}</td>
              <td
                className="text-muted small text-truncate"
                style={{ maxWidth: "250px" }}
              >
                {util.capitalize(produto.descricao, 50)}
              </td>
              <td className="text-center fw-bold text-roxo">
                {produto.itemEstoque?.length || 0}
              </td>
              <td className="text-center">
                {getEstoqueBadge(produto.itemEstoque?.length)}
              </td>
            </tr>
          ))}
          {dadosProcessados.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-4 text-muted">
                Nenhum produto encontrado com os filtros atuais.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
});

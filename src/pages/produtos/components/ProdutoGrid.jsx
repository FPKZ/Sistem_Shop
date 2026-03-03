import util from "@app/utils.js";

export function ProdutoGrid({
  dadosProcessados,
  setModalInfoProduto,
  setProduto,
  getEstoqueBadge,
}) {
  return (
    <div className="
      row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5
      align-items-stretch
      h-100 g-4 mb-4
    ">
      {dadosProcessados.map((produto) => (
        <div
          className="col hover:translate-y-[-5px] transition-transform duration-300"
          key={produto.id}
          onClick={() => {
            setModalInfoProduto(true);
            setProduto(produto);
          }}
        >
          <div className="card produto-card shadow-sm cursor-pointer border-0">
            <div
              className="produto-img-wrapper"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <img
                className="card-img-top produto-img"
                src={produto.img || "src/assets/tube-spinner.svg"}
                alt={produto.nome}
                style={{
                  objectFit: "contain",
                  height: "100%",
                  width: "100%",
                  padding: "0.5rem",
                }}
              />
            </div>
            <div className="card-body p-2">
              <h5 className="card-title text-truncate" title={produto.nome}>
                {produto.nome}
              </h5>
              <p className="card-text text-muted small">
                {util.capitalize(produto.descricao, 50)}
              </p>
            </div>
            <div className="card-footer bg-transparent row border-top-0 d-flex justify-content-between align-items-center p-2 mb-0 mt-auto">
              <div className="col-6 d-flex flex-wrap gap-1 justify-content-start align-items-end p-0 ps-2">
                <span className="fw-bold fs-5">
                  {produto.itemEstoque?.length || `0`}
                </span>
                <span className="text-muted small"> unidades</span>
              </div>
              <div className="col-6 d-flex justify-content-end align-items-center h-100 p-0 pe-2 text-end">
                {getEstoqueBadge(produto.itemEstoque?.length)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const ProdutoGrid = React.memo(({
  dadosProcessados,
  setModalInfoProduto,
  setProduto,
  getEstoqueBadge,
}) => {
  const navigate = useNavigate();
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: -15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.1 }
    }
  };
  // console.log(dadosProcessados)
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="
        row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5
        align-items-stretch
        h-100 g-4 mb-4
      "
    >
      {dadosProcessados.map((produto) => (
        <motion.div
          layout
          variants={item}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="col cursor-pointer"
          key={produto.id}
          onClick={() => {
            // setModalInfoProduto(true);
            // setProduto(produto);
            navigate(`/painel/produtos/info/${produto.id}`);
          }}
        >
          <div className="rounded-4 bg-white shadow-sm border-0 h-[25rem] d-flex flex-column overflow-hidden position-relative">
            <div
              className="produto-img-wrapper"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                height: "55%",
              }}
            >
              <img
                className="card-img-top produto-img"
                src={produto.img ? produto.img : produto.imagem || "assets/tube-spinner.svg"}
                alt={produto.nome}
                style={{
                  objectFit: "cover",
                  height: "100%",
                  width: "100%",
                  padding: "0",
                }}
              />
            </div>
            <div className="card-body p-3 d-flex flex-column flex-grow-1">
              <h5 className="card-title text-truncate fw-bold mb-1" title={produto.nome}>
                {produto.nome}
              </h5>
              <p className="card-text text-muted small mb-0" style={{ flexGrow: 1 }}>
                {produto.descricao ? 
                    (produto.descricao.length > 50 ? produto.descricao.substring(0, 80) + "..." : produto.descricao) 
                    : "Sem descrição"}
              </p>
              
              <div className="d-flex justify-content-between align-items-center mt-auto">
                <div className="d-flex flex-column">
                  <div className="fw-bold" style={{ fontSize: '1rem' }}>
                    {produto.itemEstoque?.length || 0} Uni.
                  </div>
                </div>
                <div className="h-100">
                  {getEstoqueBadge(produto.itemEstoque?.length)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
});

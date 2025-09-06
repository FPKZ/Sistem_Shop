import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Cadastro() {
  const [tela, setTela] = useState()
  const navigate = useNavigate()

  return (
    <>
      <div className="d-flex justify-content-start flex-warp flex-md-noqarp align-items-center pt-3 pb-2 mb-3 gap-2 border-bottom">
        <button className="btn btn-outline-primary" onClick={() => /*navigate(-1)*/ setTela("")}>
          <i className="bi bi-chevron-left"></i>
        </button>
        <h1 className="h2">Cadastro</h1>
        {tela && (
          <>
            <h1 className="h2">/</h1>
            <h1 className="h3">{tela}</h1>
          </>
        )}
      </div>
      <div className="row row-cols-6 gap-3">
        {
          !tela && (
            <>
              <button className="btn btn-primary" onClick={() => setTela("Produtos")}>Produto</button>
              <button className="btn btn-primary" onClick={() => setTela("Notas")}>Nota</button>
              <button className="btn btn-primary" onClick={() => setTela("Clientes")}>Cliente</button>
            </>
          )
        }
        {
          tela === "Produtos" && (
            <input type="text" name="" id="" />
          )
        }
      </div>
    </>
  );
}
export default Cadastro;

import { useState, useEffect } from "react";
import { Card } from "@components/Card";
import ProdutosCriados from "@components/modal/ProdutosCriados/ProdutosCriados";
import Produtos from "./include/Produtos";
import Clientes from "./include/Clientes";
import Notas from "./include/Notas";
import API from "../../app/api.js";
import { Button } from "react-bootstrap";

import { Outlet, useNavigate, useLocation } from "react-router-dom";
import utils from "@app/utils";

function Cadastro() {
  const [itensCriados, setItensCriados] = useState([]);
  const [modalCriar, setModalCriar] = useState(false);
  const navigate = useNavigate();
  
  const location = useLocation()
  const pathParts = location.pathname.split('/').filter(part => part)
  // console.log(pathParts);

  const cadastrarProduto = async (data) => {
    try {
      const response = await API.postProduto(data);
      setItensCriados(response.itensEstoque);
      return response;
    } catch (error) {
      console.error("erro ao cadastar", error);
    }
  };

  return (
    <div className="p-2 p-md-4">
      <div className="d-flex justify-content-center flex-wrap flex-md-nowarp align-items-start pb-3 mb-3 gap-2 border-bottom position-relative">
        <Button className="btn btn-roxo position-absolute start-0" onClick={() => {pathParts.length > 1 ? navigate(-1) : navigate('/')}}>
            <i className="bi bi-chevron-left"></i>
        </Button>
        <nav
            className="d-flex justify-content-center align-items-center m-0"
            aria-label="breadcrumb"
        >
            <ol className="breadcrumb breadcrumb-sm-chevron d-flex align-content-center m-0">
            {pathParts.length &&
                pathParts.map(tela => (
                <h1 key={tela} className="h3 breadcrumb-item m-0 d-flex align-items-center">{utils.capitalize(tela).replace('-', " ")}</h1>
                ))}
            </ol>
        </nav>
      </div>
      <div className="row row-cols-* g-2 g-md-4">
        <Outlet context={{ cadastrarProduto, setModalCriar }} />
        {/* {!tela && (
          <>
            <Card
              icon="grid-fill"
              setTela={() => {
                setTela("Produtos");
              }}
            >
              Produtos
            </Card>
            <Card
              icon="upc"
              setTela={() => {
                setTela("Notas");
              }}
            >
              Notas
            </Card>
            <Card
              icon="bi bi-person-fill-add"
              setTela={() => {
                setTela("Clientes");
              }}
            >
              Clientes
            </Card>
          </>
        )}
        {tela === "Produtos" && (
          <Produtos
            cadastrarProduto={cadastrarProduto}
            setTela={setTela}
            setModalCriar={setModalCriar}
          />
        )}
        {tela === "Clientes" && <Clientes />}
        {tela === "Notas" && <Notas />} */}
      </div>
      <ProdutosCriados
        visible={modalCriar}
        onClose={() => setModalCriar(false)}
        itens={itensCriados}
      />
    </div>
  );
}
export default Cadastro;

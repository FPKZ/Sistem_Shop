import { useState, useEffect } from "react";
import Header from "../../components/layout/components/Header";
import Menu from "../../components/layout/components/Menu";
import Produto from "./components/Produto";
import CadastroModal from "../components/modal/CadastroIntenModal";

async function api() {
  // await fetch(`http://localhost:3333/videos`, {
  //     method: "POST",
  //     headers: {
  //         "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //         titulo: "video01",
  //         descricao: "adfasdasd",
  //         duracao: 120
  //     })
  // })

  const produtos = await (
    await fetch(`https://sistemshop-production.up.railway.appprodutos`, { method: "GET" })
  ).json();
  console.log(produtos);
  return produtos;
}

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [modal, setModal] = useState(false)

  const getProdutos = async () => {
    const p = await api();
    setProdutos(p);
  }
  const cadastroProduto = async (data) => {
    await fetch(`http://localhost:3333/produto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
  }

  const deleteProduto = async (id) => {
    await fetch(`http://localhost:3333/produto/${id}`, { method: "DELETE" });
    await getProdutos();
  }

  useEffect(() => {
    getProdutos();
  }, []);

  return (
    <>
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 className="h2">Produtos</h1>
      <div className="btn-toolbar mb-2 mb-md-0">
        <button className="btn btn-primary" onClick={() => setModal(true)}>
          <i className="bi bi-plus-lg me-2"></i>
          Adicionar Produto
        </button>
      </div>
    </div>
      <Produto produtos={produtos} deleteProduto={deleteProduto} />


      <CadastroModal visible={modal} onClose={() => setModal(false)} onSubmit={async (data) =>  await cadastroProduto(data)} />
    </>
  );
}

export default Produtos;

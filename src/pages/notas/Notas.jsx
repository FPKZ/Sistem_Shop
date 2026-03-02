import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import API from "@app/api";

import { useFiltroOrdenacao } from "@hooks/useFiltroOrdenacao";
import { usePagination } from "@hooks/usePagination";

import CadastroNotaModal from "@components/modal/CadastroNota/CadastroNotaModal";
import ModalDetailNota from "@components/modal/Notas/ModalDetailNota";
import TableNota from "./include/TableNota";
import { gerarPDFNota } from "@app/generatePDF";

import { NotasHeader } from "./components/NotasHeader";
import { NotasFilter } from "./components/NotasFilter";

export default function Notas() {
  const [notas, setNotas] = useState([]);
  const [selectNota, setSelectNota] = useState(null);
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
  const [isModalCadastroOpen, setIsModalCadastroOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Todas");

  const { mobile } = useOutletContext();

  const camposFiltragem = ["codigo", "fornecedor", "status", "data"];

  const { setFiltro, order, dadosProcessados, setOrdem } = useFiltroOrdenacao(
    notas,
    camposFiltragem,
  );

  const { currentItems, currentPage, totalPages, handlePageChange } =
    usePagination(dadosProcessados);

  useEffect(() => {
    getNotas();
  }, []);

  const getNotas = async () => {
    const n = await API.getNotas();
    setNotas(n);
  };

  const handleBuy = async (id) => {
    const response = await API.putNota(id, { status: "pago" });
    console.log(response);
    await getNotas();
  };

  const handleShowDetails = (nota) => {
    setSelectNota(nota);
    setIsModalDetailOpen(true);
  };

  const handleBtnFilter = (filter) => {
    setActiveFilter(filter);
    setFiltro(filter === "Todas" ? "" : filter.toLocaleLowerCase());
  };

  const handlePrintCustom = (selectNota) => {
    console.log(selectNota);
    const config = {
      tipo: "recebimento",
      dadosNota: {
        codigo: selectNota.codigo,
        data: selectNota.data,
        fornecedor: selectNota.fornecedor,
        valor_total: selectNota.valor_total,
      },
      colunas: [
        { header: "#ID", dataKey: "id" },
        { header: "Produto", dataKey: "nome" },
        { header: "Marca", dataKey: "marca" },
        { header: "Qtd.", dataKey: "quantidade" },
        { header: "Valor Compra", dataKey: "valor_compra" },
      ],
      dadosItens: selectNota.itensNota
        ? selectNota.itensNota.map((item) => ({
            ...item,
            quantidade: 1,
          }))
        : [],
      nomeArquivo: `nota-recebimento-${selectNota.codigo}.pdf`,
    };

    gerarPDFNota(config);
  };

  return (
    <Container fluid className="py-4 m-0 px-0">
      <NotasHeader
        mobile={mobile}
        setIsModalCadastroOpen={setIsModalCadastroOpen}
      />

      <NotasFilter
        mobile={mobile}
        setFiltro={setFiltro}
        activeFilter={activeFilter}
        handleBtnFilter={handleBtnFilter}
        order={order}
        setOrdem={setOrdem}
      />

      {/* Lista de Notas */}
      {currentItems.length > 0 ? (
        <TableNota
          notas={currentItems}
          handleShowDetails={handleShowDetails}
          mobile={mobile}
          handleBuy={handleBuy}
          handlePrintCustom={handlePrintCustom}
        />
      ) : (
        <div className="alert alert-roxo text-center mt-4" role="alert">
          <p className="fw-medium fs-4 m-0">Nenhuma nota encontrada!</p>
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="mt-4">
          {/* Usando o componente original de paginação ou a refatoração do handlePageChange */}
          {/* Importado como componente dependente de dados externos */}
          <div className="my-3 mb-4 d-flex justify-content-center">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Anterior
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li
                  key={page}
                  className={`page-item ${currentPage === page ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Próxima
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      <ModalDetailNota
        visible={isModalDetailOpen}
        onClose={() => setIsModalDetailOpen(false)}
        selectNota={selectNota}
        mobile={mobile}
        handleBuy={handleBuy}
        handlePrintCustom={handlePrintCustom}
      />
      {isModalCadastroOpen && (
        <CadastroNotaModal
          visible={isModalCadastroOpen}
          onClose={() => setIsModalCadastroOpen(false)}
          produts={true}
          fullScrean={true}
        />
      )}
    </Container>
  );
}

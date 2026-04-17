import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import API from "@services";

import { useFiltroOrdenacao } from "@hooks/useFiltroOrdenacao";
import { usePagination } from "@hooks/usePagination";
import PaginationButtons from "@components/Pagination/PaginationButtons";

import ModalDetailNota from "@components/modal/Notas/ModalDetailNota";
import TableNota from "./include/TableNota";
import { printPDF, getRecebimentoConfig } from "@services/generatePDF";

import { NotasHeader } from "./components/NotasHeader";
import { NotasFilter } from "./components/NotasFilter";

export default function Notas() {
  const [notas, setNotas] = useState([]);
  const [selectNota, setSelectNota] = useState(null);
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
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
    const config = getRecebimentoConfig(selectNota);
    printPDF(config);
  };

  return (
    <Container fluid className="p-2 py-3 p-md-4">
      <NotasHeader
        mobile={mobile}
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
          <PaginationButtons
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
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
    </Container>
  );
}

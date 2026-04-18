import { useOutletContext } from "react-router-dom";
import API from "@services";

import OffcanvasSelecionarCliente from "@components/offcanvas/Vendas/OffcanvasSelecionarCliente";
import OffcanvasAdicionarProduto from "@components/offcanvas/Vendas/OffcanvasAdicionarProduto";

import { useDisclosure } from "@hooks/useDisclosure";
import { useNovaVenda } from "@hooks/vendas/useNovaVenda";

import { VendaHeader } from "./components/VendaHeader";
import { VendaCart } from "./components/VendaCart";
import { VendaResumo } from "./components/VendaResumo";

import "@css/vendas/NovaVenda.css";

export default function NovaVenda() {
  const { mobile } = useOutletContext();

  // Controle de Drawers (Offcanvas)
  const [showOffcanvasCliente, { open: openCliente, close: closeCliente }] = useDisclosure();
  const [showOffcanvasProduto, { open: openProduto, close: closeProduto }] = useDisclosure();

  // Busca do Estoque
  const {
    data: produtos,
    isLoading: isLoadingProdutos,
    error: errorProdutos,
  } = API.getProdutos({ item: "estoque" });

  // Hook principal de lógica
  const venda = useNovaVenda(produtos);

  return (
    <div className={`${mobile ? 'pb-0' : 'p-3'}`}>
      {/* Header fixo com título e toggle */}
      <VendaHeader reservar={venda.reservar} setReservar={venda.setReservar} mobile={mobile} />

      {/* Layout: Desktop = 2 colunas | Mobile = coluna única (folhas) */}
      <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-6 lg:items-start p-0">
        {/* Coluna esquerda: Cliente + Produtos */}
        <div>
          <VendaCart
            cliente={venda.cliente}
            onOpenCliente={openCliente}
            listaVenda={venda.cart.listaVenda}
            onOpenProduto={openProduto}
            produtos={produtos || []}
            handleAlterarQuantidade={venda.cart.handleAlterarQuantidade}
            handleRemoverProduto={venda.cart.handleRemoverProduto}
          />
        </div>

        {/* Coluna direita: Resumo da Venda */}
        <div>
          <VendaResumo
            cliente={venda.cliente}
            listaVenda={venda.cart.listaVenda}
            pagamentoState={venda.pagamentoState}
            calcularSubtotal={venda.cart.calcularSubtotal}
            handleFinalizarVenda={venda.handleFinalizarVenda}
            handleCancelarVenda={venda.handleCancelarVenda}
            isLoading={venda.isLoading}
            reservar={venda.reservar}
            prazoReserva={venda.prazoReserva}
            setPrazoReserva={venda.setPrazoReserva}
            podeFinalizar={venda.canFinalize}
          />
        </div>
      </div>

      {/* Drawers (Offcanvas) */}
      <OffcanvasSelecionarCliente
        show={showOffcanvasCliente}
        onHide={closeCliente}
        onSelect={venda.setCliente}
      />

      {produtos && !isLoadingProdutos && !errorProdutos && (
        <OffcanvasAdicionarProduto
          show={showOffcanvasProduto}
          onHide={closeProduto}
          produtos={produtos}
          onAdd={venda.cart.handleAdicionarProduto}
          calcularItensAjustados={venda.cart.calcularItensAjustados}
        />
      )}
    </div>
  );
}

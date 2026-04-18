import utils from "@services/utils";
import { Trash2, Package, UserPlus, ShoppingCart, ChevronRight } from "lucide-react";
import { Dropdown } from "react-bootstrap";

export function VendaCart({
  cliente,
  onOpenCliente,
  listaVenda,
  onOpenProduto,
  produtos,
  handleAlterarQuantidade,
  handleRemoverProduto,
}) {
  const iniciais = cliente?.nome
    ? cliente.nome.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : null;

  return (
    <>
      {/* ===================== SEÇÃO CLIENTE ===================== */}
      <div className="sheet-section px-6 py-4 z-[2] lg:rounded-2xl lg:mb-4">
        <p className="section-label mb-3">Cliente</p>

        {cliente ? (
          <div
            className="flex items-center gap-3.5 px-4 py-3 bg-[#f9f6ff] border-[1.5px] border-[#dcc8ff] rounded-xl cursor-pointer transition-all duration-200 hover:border-[#9b72e8] hover:shadow-[0_0_0_3px_rgba(111,66,193,0.08)]"
            onClick={onOpenCliente}
            role="button"
          >
            <div className="w-10! h-10! rounded-full avatar-gradient-roxo text-[1rem]">
              {iniciais}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="font-bold text-[#1a1a2e] leading-none truncate">{cliente.nome}</div>
              <div className="text-sm text-gray-500 truncate mt-1">
                {cliente.telefone || cliente.email || "Sem contato cadastrado"}
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400 shrink-0" />
          </div>
        ) : (
          <div
            className="flex items-center gap-3 px-4 py-3.5 bg-[#f9f6ff] border-2 border-dashed border-[#dcc8ff] rounded-xl cursor-pointer transition-all duration-200 text-[#9c8ab4] hover:bg-[#f3eeff] hover:border-[#b08ef0] hover:text-[#6f42c1]"
            onClick={onOpenCliente}
            role="button"
          >
            <div className="w-10! h-10! rounded-full bg-[#f3eeff] flex items-center justify-center shrink-0">
              <UserPlus size={20} color="#9b72e8" />
            </div>
            <div>
              <div className="font-semibold text-[#6f42c1]">
                Selecionar cliente
              </div>
              <div className="text-sm text-[#b0a0cc]">
                Toque para buscar ou cadastrar
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===================== SEÇÃO PRODUTOS ===================== */}
      <div className="bg-[#faf9fc] px-6 py-5 min-h-[160px] relative z-[1] shadow-[0_8px_20px_rgba(0,0,0,0.05)] lg:rounded-2xl">
        <div className="flex justify-between items-center mb-3">
          <p className="section-label mb-0">
            Produtos
            {listaVenda.length > 0 && (
              <span className="ml-2 px-2 py-0 inline-block bg-[#6f42c1] text-white text-[0.7rem] font-bold rounded-full leading-[1.8]">
                {listaVenda.length}
              </span>
            )}
          </p>
        </div>

        {listaVenda.length === 0 ? (
          <div className="text-center py-8 text-[#c0b0db]">
            <ShoppingCart size={40} className="mb-2 opacity-50 mx-auto" />
            <div className="text-sm">
              {cliente
                ? "Nenhum produto adicionado"
                : "Selecione um cliente primeiro"}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 lg:max-h-[420px] lg:overflow-y-auto lg:pr-1">
            {listaVenda.map((item) => {
              const precoUnit = Math.max(
                ...item.itens.map((i) => i.valor_venda),
                0
              );
              const subtotal = item.itens.reduce(
                (t, i) => t + i.valor_venda,
                0
              );
              const maxQty =
                produtos.find((p) => p.id === item.id)?.itemEstoque?.length || 0;

              return (
                <div key={item.id} className="bg-white rounded-xl p-2 px-3 border border-[#ede8f7] flex items-center gap-3 transition-shadow duration-200 hover:shadow-[0_2px_12px_rgba(111,66,193,0.1)]">
                  {/* Ícone do produto */}
                  <div className="w-[44px] h-[44px] rounded-[10px] bg-[#f3eeff] flex items-center justify-center shrink-0">
                    {item.img ? (
                      <img
                        src={item.img}
                        alt={item.nome}
                        className="w-full h-full object-cover rounded-[10px]"
                      />
                    ) : (
                      <Package size={22} color="#9b72e8" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 overflow-hidden">
                    <div className="font-bold truncate text-[#1a1a2e] text-[0.9rem]">
                      {item.nome}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[0.75rem] text-[#28a745] font-semibold">
                        {utils.formatMoney(precoUnit)} / un.
                      </span>
                    </div>
                  </div>

                  {/* Controle de quantidade */}
                  <div className="flex items-center gap-3">
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="link"
                        className="p-0 border-0 no-underline! shadow-none! dropdown-toggle-none"
                      >
                        <div className="flex items-center bg-[#f3eeff] rounded-lg overflow-hidden border border-[#dcc8ff]">
                          <span className="px-2.5 py-1 font-bold text-[0.9rem] text-[#1a1a2e] min-w-[32px] text-center cursor-pointer">
                            {item.quantidade}×
                          </span>
                        </div>
                      </Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        {Array.from(
                          { length: maxQty },
                          (_, i) => i + 1
                        ).map((qty) => (
                          <Dropdown.Item
                            key={qty}
                            className="text-center"
                            active={qty === item.quantidade}
                            onClick={() =>
                              handleAlterarQuantidade(item.id, qty)
                            }
                          >
                            {qty}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>

                    <div className="font-bold text-[#1a1a2e] text-[0.9rem]">
                      {utils.formatMoney(subtotal)}
                    </div>
                  </div>

                  {/* Remover */}
                  <button
                    onClick={() => handleRemoverProduto(item.id)}
                    className="bg-transparent border-none py-1.5 pl-2 pr-1 cursor-pointer text-[#e0c5ff] shrink-0 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Botão Adicionar Produto */}
        <button
          className="w-full p-3.5 bg-gradient-to-br! from-[#f4eeff] to-[#ede8f7] border-2 border-dashed border-[#c9b2f0] rounded-xl! text-[#6f42c1] font-semibold text-[0.9rem] flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 mt-3 hover:from-[#ede8f7] hover:to-[#dcc8ff] hover:border-[#9b72e8] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onOpenProduto}
          onMouseDown={(e) => e.preventDefault()}
          disabled={!cliente}
        >
          <span className="w-6 h-6 rounded-full bg-[#6f42c1] text-white flex items-center justify-center text-[1.1rem] leading-none shrink-0">
            +
          </span>
          Adicionar produto
        </button>
      </div>
    </>
  );
}

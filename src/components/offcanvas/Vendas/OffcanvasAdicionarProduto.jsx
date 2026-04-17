import { Offcanvas, Form } from "react-bootstrap";
import {
  Search,
  Package,
  ChevronLeft,
  Minus,
  Plus,
  Hash,
  Check,
} from "lucide-react";
import { useState, useEffect } from "react";
import utils from "@services/utils";

export default function OffcanvasAdicionarProduto({
  show,
  onHide,
  produtos,
  onAdd,
  calcularItensAjustados,
}) {
  const [busca, setBusca] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [quantidade, setQuantidade] = useState(1);

  const produtosFiltrados = produtos.filter(
    (produto) =>
      produto.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      produto.codigo?.includes(busca)
  );

  useEffect(() => {
    if (produtoSelecionado && itensSelecionados.length === 0) {
      setItensSelecionados([produtoSelecionado.itemEstoque[0]]);
    }
    if (itensSelecionados.length > 0 && quantidade !== itensSelecionados.length) {
      setQuantidade(itensSelecionados.length);
    }
  }, [produtoSelecionado, itensSelecionados, quantidade]);

  const handleQuantidade = (delta) => {
    const nova = quantidade + delta;
    if (nova < 1 || nova > produtoSelecionado.itemEstoque.length) return;
    setQuantidade(nova);
    if (calcularItensAjustados) {
      setItensSelecionados(
        calcularItensAjustados(
          itensSelecionados,
          produtoSelecionado.itemEstoque,
          nova
        )
      );
    }
  };

  const handleAdd = () => {
    if (!produtoSelecionado) return;
    const { id, nome, categoria, img, descricao } = produtoSelecionado;
    onAdd({ id, nome, categoria, img, descricao, itens: itensSelecionados, quantidade });
    handleReset();
    onHide();
  };

  const toggleItem = (item) => {
    const selected = itensSelecionados.some((i) => i.id === item.id);
    if (selected) {
      setItensSelecionados(itensSelecionados.filter((i) => i.id !== item.id));
    } else {
      setItensSelecionados([...itensSelecionados, item]);
    }
  };

  const handleReset = () => {
    setProdutoSelecionado(null);
    setItensSelecionados([]);
    setQuantidade(1);
    setBusca("");
  };

  const precoMax = produtoSelecionado
    ? Math.max(...produtoSelecionado.itemEstoque.map((i) => i.valor_venda), 0)
    : 0;

  return (
    <Offcanvas
      show={show}
      onHide={() => { handleReset(); onHide(); }}
      placement="end"
      className="w-[min(460px,100vw)] max-w-full p-0 flex flex-col"
    >
      {/* ── Header roxo ── */}
      <div className="bg-gradient-to-br from-[#2d1d50] to-[#6f42c1] pt-5 px-5 pb-14 relative shrink-0">
        <button
          onClick={() => { handleReset(); onHide(); }}
          className="absolute top-3.5 right-3.5 bg-white/15 border-none rounded-full! w-8 h-8 text-white text-[1.1rem] cursor-pointer flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          ×
        </button>

        <div className="flex items-center gap-3">
          {produtoSelecionado && (
            <button
              onClick={() => setProdutoSelecionado(null)}
              className="bg-white/15 border-none rounded-full! w-[34px] h-[34px] text-white cursor-pointer flex items-center justify-center shrink-0 hover:bg-white/25 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          <div className="w-[42px] h-[42px] rounded-full! bg-white/15 flex items-center justify-center shrink-0">
            <Package size={22} color="#fff" />
          </div>
          <div>
            <div className="font-bold text-white text-[1.1rem] leading-tight">
              {produtoSelecionado ? produtoSelecionado.nome : "Adicionar Produto"}
            </div>
            <div className="text-white/60 text-[0.8rem] mt-0.5">
              {produtoSelecionado
                ? `${produtoSelecionado.itemEstoque.length} unidades disponíveis`
                : "Busque pelo nome ou código"}
            </div>
          </div>
        </div>
      </div>

      {/* ── Busca (só na lista) ── */}
      {!produtoSelecionado && (
        <div className="px-5 -mt-7 relative z-10 shrink-0">
          <div className="relative">
            <Search
              size={18}
              className="absolute top-1/2 right-3.5 -translate-y-1/2 text-[#9b72e8]"
            />
            <Form.Control
              type="text"
              placeholder="Nome ou código..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              autoFocus
              className="pl-11 rounded-xl! border-[1.5px] border-[#dcc8ff] shadow-[0_4px_20px_rgba(111,66,193,0.15)] h-12 text-[0.95rem] placeholder:text-[#9b72e8]/50 focus:border-[#6f42c1] focus:ring-2 focus:ring-[#6f42c1]/20"
            />
          </div>
        </div>
      )}

      {/* ── Corpo ── */}
      <div className={`overflow-y-auto flex-1 ${produtoSelecionado ? 'pt-0' : 'pt-3'}`}>
        {/* Lista de produtos */}
        {!produtoSelecionado && (
          <div>
            {produtosFiltrados.length === 0 ? (
              <div className="text-center py-12 text-[#b0a0cc]">
                <Package size={40} className="mb-3 opacity-50 mx-auto" />
                <div>{busca ? "Nenhum produto encontrado" : "Nenhum produto disponível"}</div>
              </div>
            ) : (
              produtosFiltrados.map((produto) => {
                const sem = produto.itemEstoque.length === 0;
                const preco = Math.max(
                  ...produto.itemEstoque.map((i) => i.valor_venda),
                  0
                );
                console.log(produto)
                return (
                  <div
                    key={produto.id}
                    onClick={() => !sem && setProdutoSelecionado(produto)}
                    className={`flex items-center gap-3.5 px-5 py-3.5 border-b border-[#f4eeff] transition-colors duration-150 ${sem ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-[#faf7ff]'}`}
                  >
                    {/* Ícone */}
                    <div className="w-[44px] h-[44px] rounded-[10px]! bg-[#f3eeff] flex items-center justify-center shrink-0">
                      {produto.img ? (
                        <img src={produto.img} alt={produto.nome} className="w-full h-full object-cover rounded-[10px]!" />
                      ) : (
                        <Package size={20} color="#9b72e8" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 overflow-hidden">
                      <div className="font-bold text-[#1a1a2e] text-[0.9rem] whitespace-nowrap overflow-hidden text-ellipsis">
                        {produto.nome}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {/* <span className="text-[0.72rem] text-[#8b8fa8] bg-[#f3eeff] px-1.5 py-[1px] rounded leading-relaxed">
                          {produto.descricao}
                        </span> */}
                        <span
                          className={`text-[0.72rem] font-bold leading-relaxed ${
                            produto.itemEstoque.length > 10
                              ? "text-[#28a745]"
                              : produto.itemEstoque.length > 0
                              ? "text-[#f59e0b]"
                              : "text-[#dc3545]"
                          }`}
                        >
                          {produto.itemEstoque.length} un.
                        </span>
                      </div>
                    </div>

                    {/* Preço */}
                    <div className="font-bold text-[#28a745] text-[0.95rem] shrink-0">
                      {utils.formatMoney(preco)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Detalhes do produto selecionado */}
        {produtoSelecionado && (
          <div>
            {/* Resumo preço */}
            <div className="px-5 py-4 bg-[#faf7ff] border-b border-[#ede8f7]">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[#8b8fa8] text-[0.85rem]">Preço unitário</span>
                <span className="font-bold text-[#28a745] text-[1.1rem]">
                  {utils.formatMoney(precoMax)}
                </span>
              </div>

              {/* Controle de quantidade */}
              <div className="flex items-center gap-3">
                <span className="text-[0.85rem] text-[#8b8fa8]">Quantidade:</span>
                <div className="flex items-center bg-white border-[1.5px] border-[#dcc8ff] rounded-[10px] overflow-hidden">
                  <button
                    onClick={() => handleQuantidade(-1)}
                    className="bg-transparent border-none py-2 px-3.5 text-[#6f42c1] font-bold cursor-pointer hover:bg-gray-50"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="py-2 px-4 font-bold text-[#1a1a2e] min-w-[40px] text-center">
                    {quantidade}
                  </span>
                  <button
                    onClick={() => handleQuantidade(1)}
                    className="bg-transparent border-none py-2 px-3.5 text-[#6f42c1] font-bold cursor-pointer hover:bg-gray-50"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="text-[0.8rem] text-[#9c8ab4]">
                  máx. {produtoSelecionado.itemEstoque.length}
                </span>
              </div>
            </div>

            {/* Lista de itens de estoque */}
            <div className="px-5 py-3">
              <p className="text-[0.7rem] font-bold tracking-[0.08em] uppercase text-[#9c8ab4] mb-2.5">
                Itens de Estoque
              </p>
              <div className="flex flex-col gap-2">
                {produtoSelecionado.itemEstoque.map((item) => {
                  const selected = itensSelecionados.some((i) => i.id === item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item)}
                      className={`border-[1.5px] rounded-xl p-3 cursor-pointer transition-all duration-150 ${selected ? 'border-[#9b72e8] bg-[#f9f6ff]' : 'border-[#ede8f7] bg-white hover:border-[#dcc8ff]'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-2 items-center mb-1">
                          <div className="bg-[#f3eeff] rounded-[6px] px-1.5 py-0.5 flex items-center gap-0.5 text-[#6f42c1] text-[0.72rem] font-bold">
                            <Hash size={10} />
                            {item.id}
                          </div>
                          <span className="font-semibold text-[#1a1a2e] text-[0.9rem] leading-none">
                            {item.nome}
                          </span>
                        </div>

                        {/* Checkbox visual */}
                        <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 transition-all duration-150 ${selected ? 'bg-gradient-to-br from-[#9b72e8] to-[#6f42c1] border-none' : 'bg-[#f3eeff] border-[1.5px] border-[#dcc8ff]'}`}>
                          {selected && <Check size={12} color="#fff" strokeWidth={3} />}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[0.78rem] text-[#8b8fa8] mt-1">
                        {item.marca && (
                          <span>Marca: <strong className="text-[#4a4060] font-medium">{item.marca}</strong></span>
                        )}
                        <div className="flex justify-between">
                          {item.tamanho && (
                            <span>Tamanho: <strong className="text-[#4a4060] font-medium">{item.tamanho}</strong></span>
                          )}
                          {item.cor && (
                            <span className="flex items-center gap-1">
                              Cor:
                              <div className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: item.cor }}></div>
                            </span>
                          )}
                        </div>
                        <div className="col-span-full flex justify-between items-center mt-2 pt-2 border-top border-[#ede8f7]">
                          {item.codigo_barras && (
                            <span className="flex ">
                              Código: <span>{item.codigo_barras}</span>
                            </span>
                          )}
                          <span className="text-right text-[#28a745] font-bold text-[0.85rem]">
                            {utils.formatMoney(item.valor_venda)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Botão Adicionar (footer) ── */}
      {produtoSelecionado && (
        <div className="px-5 py-4 border-t border-[#ede8f7] bg-white shrink-0">
          <button
            onClick={handleAdd}
            className="w-full p-4 bg-gradient-to-br from-[#9b72e8] to-[#6f42c1] border-none rounded-[14px]! text-white font-bold text-[1rem] cursor-pointer flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(111,66,193,0.35)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            <span>Adicionar à Venda</span>
            <span className="bg-white/20 rounded-full py-0.5 px-3 text-[0.9rem] font-bold">
              {utils.formatMoney(precoMax * quantidade)}
            </span>
          </button>
        </div>
      )}
    </Offcanvas>
  );
}

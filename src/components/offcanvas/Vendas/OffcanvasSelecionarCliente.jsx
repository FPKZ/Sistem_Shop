import { Offcanvas, Form, Spinner } from "react-bootstrap";
import { useState } from "react";
import API from "@services";
import { Search, Phone, Mail, MapPin, User, ChevronRight } from "lucide-react";

export default function OffcanvasSelecionarCliente({ show, onHide, onSelect }) {
  const [busca, setBusca] = useState("");
  const { data: clientes, isLoading, error } = API.getClientes();

  const clientesFiltrados = clientes?.filter(
    (c) =>
      c.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      c.telefone?.includes(busca)
  );

  const handleSelect = (cliente) => {
    onSelect(cliente);
    onHide();
    setBusca("");
  };

  const iniciais = (nome) =>
    nome
      ? nome.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
      : "?";

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="end"
      className="w-[min(420px,100vw)] max-w-full p-0 flex flex-col"
    >
      {/* Header roxo */}
      <div className="bg-gradient-to-br from-[#2d1d50] to-[#6f42c1] pt-5 px-6 pb-14 relative shrink-0">
        <button
          onClick={onHide}
          className="absolute top-4 right-4 bg-white/15 border-none rounded-full! w-8 h-8 text-white text-[1rem] cursor-pointer flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          ×
        </button>
        <div className="flex items-center gap-3">
          <div className="w-[42px] h-[42px] rounded-full bg-white/15 flex items-center justify-center shrink-0">
            <User size={22} color="#fff" />
          </div>
          <div>
            <div className="font-bold text-white text-[1.1rem]">
              Selecionar Cliente
            </div>
            <div className="text-white/60 text-[0.8rem]">
              Busque pelo nome ou telefone
            </div>
          </div>
        </div>
      </div>

      {/* Barra de busca sobreposta */}
      <div className="px-5 -mt-7 relative z-10 shrink-0">
        <div className="relative">
          <Search
            size={18}
            className="absolute top-1/2 right-3.5 -translate-y-1/2 text-[#9b72e8]"
          />
          <Form.Control
            type="text"
            placeholder="Nome ou telefone..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            autoFocus
            className="pl-11 rounded-xl border-[1.5px] border-[#dcc8ff] shadow-[0_4px_20px_rgba(111,66,193,0.15)] h-12 text-[0.95rem] placeholder:text-[#9b72e8]/50 focus:border-[#6f42c1] focus:ring-2 focus:ring-[#6f42c1]/20"
          />
        </div>
      </div>

      {/* Lista de clientes */}
      <div className="overflow-y-auto flex-1 py-4">
        {isLoading && (
          <div className="flex justify-center py-12">
            <Spinner animation="border" className="text-[#6f42c1]" />
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-red-500 text-sm">{error.message}</div>
        )}

        {!isLoading && !error && clientesFiltrados?.length === 0 && (
          <div className="text-center py-12 text-[#b0a0cc]">
            <User size={40} className="mb-3 opacity-50 mx-auto" />
            <div>{busca ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}</div>
          </div>
        )}

        {!isLoading &&
          !error &&
          clientesFiltrados?.map((cliente) => (
            <div
              key={cliente.id}
              onClick={() => handleSelect(cliente)}
              className="flex items-center gap-3.5 px-5 py-3.5 cursor-pointer border-b border-[#f4eeff] transition-colors duration-150 hover:bg-[#faf7ff] group"
            >
              {/* Avatar iniciais globais */}
              <div className="w-[44px] h-[44px] rounded-full avatar-gradient-roxo text-[0.95rem]">
                {iniciais(cliente.nome)}
              </div>

              {/* Info */}
              <div className="flex-1 overflow-hidden">
                <div className="font-bold text-[#1a1a2e] text-[0.95rem] whitespace-nowrap overflow-hidden text-ellipsis">
                  {cliente.nome}
                </div>
                <div className="flex flex-col gap-0.5 mt-1">
                  {cliente.telefone && (
                    <div className="flex items-center gap-1.5 text-[#8b8fa8] text-[0.78rem]">
                      <Phone size={12} /> {cliente.telefone}
                    </div>
                  )}
                  {cliente.email && (
                    <div className="flex items-center gap-1.5 text-[#8b8fa8] text-[0.78rem]">
                      <Mail size={12} /> {cliente.email}
                    </div>
                  )}
                  {(cliente.rua || cliente.cidade) && (
                    <div className="flex items-center gap-1.5 text-[#8b8fa8] text-[0.78rem]">
                      <MapPin size={12} />
                      {[cliente.rua, cliente.numero, cliente.cidade]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  )}
                </div>
              </div>

              <ChevronRight size={18} className="text-[#dcc8ff] shrink-0 group-hover:text-[#9b72e8] transition-colors" />
            </div>
          ))}
      </div>
    </Offcanvas>
  );
}

import { Form } from "react-bootstrap";
import { ShoppingBag, Bookmark } from "lucide-react";

export function VendaHeader({ reservar, setReservar, mobile }) {
  return (
    <div className={`px-6 pb-4 flex justify-between items-center gap-3 ${mobile ? 'bg-white border-[#f0eaf9] border-b shadow-[0_4px_16px_rgba(111,66,193,0.07)] sticky top-0 z-10 p-3' : ''}`}>
      <div>
        <h1 className="text-[1.3rem] font-bold text-[#1a1a2e] m-0">
          {reservar ? "Nova Reserva" : "Nova Venda"}
        </h1>
        <p className="text-[0.8rem] text-[#8b8fa8] m-0 ms-2 mt-1">
          {reservar
            ? "Reserve produtos para o cliente"
            : "Registre uma venda para o cliente"}
        </p>
      </div>

      <label
        htmlFor="switch-reservar"
        className={`flex! items-center gap-2 rounded-full w-auto! px-3.5 py-1.5 cursor-pointer transition-all duration-200 select-none border ${
          reservar 
            ? "bg-[#6f42c1] border-[#6f42c1] text-white" 
            : "bg-[#f4eeff] border-[#dcc8ff] text-[#6f42c1]"
        }`}
      >
        {reservar ? <Bookmark size={15} /> : <ShoppingBag size={15} />}
        <span className="font-semibold text-[0.85rem]">
          {reservar ? "Reserva" : "Venda"}
        </span>
        <Form.Check
          type="switch"
          id="switch-reservar"
          checked={reservar}
          onChange={(e) => setReservar(e.target.checked)}
          className="m-0 hidden"
        />
        {/* Switch real (invisível, acionado pelo label) */}
        <div
          className={`w-[34px] h-[20px] rounded-full relative transition-colors duration-200 ${
            reservar ? "bg-white/30" : "bg-[#dcc8ff]"
          }`}
        >
          <div
            className={`absolute top-[2px] w-[16px] h-[16px] rounded-full bg-white shadow-sm transition-all duration-200 ${
              reservar ? "left-[16px]" : "left-[2px]"
            }`}
          />
        </div>
      </label>
    </div>
  );
}

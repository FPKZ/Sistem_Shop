import { COMPANY_INFO } from "@app/companyConfig";
import { ChevronLeft, Menu } from "lucide-react";

export default function Header({carrinhoAberto, telaProduto, voltar, setMenuAberto}) {
    return (
        <header 
            className="d-flex justify-content-center align-items-center p-3 shadow-sm position-relative"
            style={{ backgroundColor: "rgba(147, 51, 179, 1)" }}
        >
            {
                carrinhoAberto || telaProduto ? (
                    <button className="btn-roxo position-absolute start-3 p-2 rounded" onClick={voltar} title="Voltar ao Catálogo">
                        <ChevronLeft size={20} />
                    </button>
                ) : (
                    <button className="btn-roxo position-absolute start-3 p-2 rounded d-lg-none" onClick={() => setMenuAberto()} title="Menu de Categorias">
                        <Menu size={20} />
                    </button>
                )
            }
            <img 
                src={COMPANY_INFO.logoPath} 
                alt={COMPANY_INFO.name} 
                style={{ height: "60px", maxWidth: "100%", objectFit: "contain" }} 
            />
        </header>
    );
}
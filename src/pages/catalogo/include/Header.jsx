import { COMPANY_INFO } from "@app/companyConfig";
import { ChevronLeft } from "lucide-react";

export default function Header({carrinhoAberto, setCarrinhoAberto}) {
    return (
        <header 
            className="d-flex justify-content-center align-items-center p-3 shadow-sm position-relative"
            style={{ backgroundColor: "rgba(147, 51, 179, 1)" }}
        >
            {
                carrinhoAberto && (
                    <button className="btn-roxo position-absolute start-3 p-2 rounded" onClick={() => setCarrinhoAberto(false)}><ChevronLeft size={20} /></button>
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
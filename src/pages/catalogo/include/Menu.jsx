

import { LayoutGrid, X } from "lucide-react";

export default function Menu({ categorias, setFiltro, filtro, isOpen, onClose, isMobile }) {
    
    // Função interna para lidar com a seleção de categoria
    const handleSelectCategory = (cat) => {
        setFiltro(prev => ({ ...prev, categoria: cat }));
        if (isMobile && onClose) {
            onClose();
        }
    };


    const menuContent = (
        <div className="d-flex flex-column h-100 bg-white">
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2" style={{ color: "rgba(147, 51, 179, 1)" }}>
                    <LayoutGrid size={22} />
                    <span>Categorias</span>
                </h5>
                {isMobile && (
                    <button className="btn btn-light rounded-circle p-1" onClick={onClose}>
                        <X size={20} />
                    </button>
                )}
            </div>

            <div className="flex-grow-1 overflow-auto p-3">
                <div className="list-group list-group-flush">
                    <button 
                        className={`list-group-item list-group-item-action border-0 rounded-3 mb-1 py-3 px-4 d-flex align-items-center justify-content-between ${(!filtro.categoria || filtro.categoria === "") ? "active bg-roxo-soft text-roxo fw-bold" : "text-muted"}`}
                        onClick={() => handleSelectCategory("")}
                        style={(!filtro.categoria || filtro.categoria === "") ? { backgroundColor: "#f3e5f5", color: "#9333b3" } : {}}
                    >
                        <span>Todas as Categorias</span>
                        {(!filtro.categoria || filtro.categoria === "") && <div style={{ width: "6px", height: "6px", backgroundColor: "#9333b3", borderRadius: "50%" }}></div>}
                    </button>

                    {categorias?.map((categoria) => {
                        const isActive = filtro.categoria === categoria;

                        return (
                            <button 
                                key={categoria.id}
                                className={`list-group-item list-group-item-action border-0 rounded-3 mb-1 py-3 px-4 d-flex align-items-center justify-content-between ${isActive ? "active bg-roxo-soft text-roxo fw-bold" : "text-muted"}`}
                                onClick={() => handleSelectCategory(categoria.nome)}
                                style={isActive ? { backgroundColor: "#f3e5f5", color: "#9333b3" } : {}}
                            >
                                <span className="text-capitalize">{categoria.nome}</span>
                                {isActive && <div style={{ width: "6px", height: "6px", backgroundColor: "#9333b3", borderRadius: "50%" }}></div>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* <div className="p-3 border-top mt-auto bg-light shadow-sm">
                <small className="text-muted d-block text-center">Filtre seus produtos favoritos</small>
            </div> */}
        </div>
    );

    // Renderização condicional baseada no modo (isMobile ou Desktop)
    if (isMobile) {
        return (
            <>
                <div 
                    className={`offcanvas-backdrop fade ${isOpen ? "show" : ""}`} 
                    style={{ display: isOpen ? "block" : "none", zIndex: 1040 }}
                    onClick={onClose}
                ></div>
                <div 
                    className={`offcanvas offcanvas-start shadow ${isOpen ? "show" : ""}`} 
                    tabIndex="-1" 
                    style={{ visibility: isOpen ? "visible" : "hidden", zIndex: 1041, width: "280px" }}
                >
                    {menuContent}
                </div>
            </>
        );
    }

    // Modo Desktop (Sidebar estática)
    return menuContent;
}
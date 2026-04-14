import { Dropdown } from "react-bootstrap";
import { ArrowDownWideNarrow, Search, X } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import PaginationControl from "@components/Pagination/PaginationControl";


export default function Produtos({
    produtos, 
    currentItems,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    indexOfFirstItem,
    indexOfLastItem,
    handlePageChange,
    handleItemsPerPageChange,
    ordenarPorChave, 
    setFiltro, 
    filtro, 
    handleBadge, 
    selecionarProduto, 
    setTelaProduto,
    shouldAnimate = true
}){
    
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
            staggerChildren: 0.1 // Anima os filhos um por um com atraso
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: -15 },
        show: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.1 }
        }
    }
    
    return (
        <div className="px-2 d-flex flex-column flex-grow-1">
            <h2 className="flex flex-shrink-0 items-center gap-2 mb-4">
                <div className="flex-grow-1 position-relative">
                    <input type="text" className="form-control" placeholder="Buscar produtos" value={filtro.nome || ""} onChange={(e) => setFiltro({ ...filtro, nome: e.target.value })} />
                    <div className="flex justify-content-center align-items-center position-absolute top-5 end-3 translate-middle-y">
                        {
                            filtro.nome ? (
                                <button className="d-flex align-items-center justify-content-center" onClick={() => setFiltro({ ...filtro, nome: "" })}>
                                    <X size={15} color="#9333b3" />
                                </button>
                            ) : (
                                <Search size={15} color="#9333b3" />
                            )
                        }
                    </div>
                </div>
                <Dropdown>
                    <Dropdown.Toggle className="dropdown-toggle-none" variant="none" id="dropdown-basic">
                        <div className="flex items-center gap-0">
                            <ArrowDownWideNarrow size={25} />
                        </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => ordenarPorChave("preco", "desc")}>Maior preço</Dropdown.Item>
                        <Dropdown.Item onClick={() => ordenarPorChave("preco", "asc")}>Menor preço</Dropdown.Item>
                        <Dropdown.Item onClick={() => ordenarPorChave("nome", "asc")}>Ordem alfabética</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </h2>

            {produtos === undefined || produtos.length === 0 ? (
                <div className="text-center text-muted mt-5 flex-grow-1">Carregando produtos ou o catálogo está vazio...</div>
            ) : (
                <div className="d-flex flex-column gap-3 justify-content-between flex-grow-1" >
                    <motion.ul 
                        variants={container} 
                        initial={shouldAnimate ? "hidden" : false} 
                        animate="show" 
                        className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-4 row-cols-xl-5 align-items-stretch g-4 list-unstyled"
                    >
                        {currentItems.map((produto) => {
                            return (
                                <motion.li 
                                layout
                                variants={item}
                                whileHover={{ scale: produto.quantidade === "Esgotado" ? 1 : 1.05 }}
                                whileTap={{ scale: produto.quantidade === "Esgotado" ? 1 : 0.95 }}
                                className="col cursor-pointer" 
                                key={produto.id} 
                                onClick={() => {
                                    selecionarProduto(produto);
                                    setTelaProduto(true);
                                }}>
                                    <div 
                                        className="rounded-4 bg-neutral-800/40 shadow-sm border-0 h-[22rem] overflow-hidden">
                                        <div
                                            className="bg-white w-100 h-100 flex flex-column position-relative"
                                            style={{opacity: produto.quantidade === "Esgotado" ? "0.5" : "1"}}
                                        >
                                            {handleBadge(produto.id)}
                                            <div
                                                className="produto-img-wrapper"
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    overflow: "hidden",
                                                    height: "50%",
                                                }}
                                                >
                                                <img
                                                    className="card-img-top produto-img"
                                                    src={produto.img ? produto.img : produto.imagem || "assets/tube-spinner.svg"}
                                                    alt={produto.nome}
                                                    style={{
                                                        objectFit: "cover",
                                                        height: "100%",
                                                        width: "100%",
                                                        padding: "0",
                                                    }}
                                                    />
                                            </div>
                                            <div className="card-body p-3 d-flex flex-column flex-grow-1">
                                                <h5 className="card-title text-truncate fw-bold mb-1" title={produto.nome}>
                                                    {produto.nome}
                                                </h5>
                                                <p className="card-text text-muted small mb-0" style={{ flexGrow: 1 }}>
                                                    {produto.descricao ? 
                                                        (produto.descricao.length > 50 ? produto.descricao.substring(0, 80) + "..." : produto.descricao) 
                                                        : "Sem descrição"}
                                                </p>
                                                {produto.quantidade === "Esgotado" ? (
                                                    <div className="fw-bold fs-5 text-danger text-end mb-0">
                                                        Esgotado
                                                    </div>
                                                ) : (
                                                    <div className="fw-bold fs-5 text-success text-end mb-0">
                                                        R$ {Number(produto.preco || 0).toFixed(2).replace('.', ',')}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.li>
                            );
                        })}
                    </motion.ul>
                    <PaginationControl
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                        totalItems={totalItems}
                        indexOfFirstItem={indexOfFirstItem}
                        indexOfLastItem={indexOfLastItem}
                    />
                </div>
            )}
        </div>
    )
}

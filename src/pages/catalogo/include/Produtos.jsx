import { Dropdown } from "react-bootstrap";
import { ArrowDown, ListFilter, ArrowDownWideNarrow, Search, X } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";


export default function Produtos({produtos, ordenarPorChave, setFiltro, filtro, handleBadge, selecionarProduto, setTelaProduto}){
    
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
            transition: { duration: 0.3 }
        }
    }
    
    return (
        <main className="px-2 flex-grow-1">
            <h2 className="flex items-center gap-2 mb-4">
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
                <div className="text-center text-muted mt-5">Carregando produtos ou o catálogo está vazio...</div>
            ) : (
                <motion.ul variants={container} initial="hidden" animate="show" className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-4 row-cols-xl-5 align-items-stretch g-4 list-unstyled">
                    {produtos.map((produto) => {
                        return (
                            <motion.li 
                                layout
                                variants={item}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="col cursor-pointer" 
                                key={produto.id} 
                                onClick={() => {
                                    selecionarProduto(produto);
                                    setTelaProduto(true);
                                }}>
                                <div className="rounded-4 bg-white shadow-sm border-0 h-100 min-h-[25rem] d-flex flex-column overflow-hidden position-relative">
                                    {handleBadge(produto.id)}
                                    <div
                                        className="produto-img-wrapper"
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            overflow: "hidden",
                                            height: "60%",
                                        }}
                                    >
                                        <img
                                            className="card-img-top produto-img"
                                            src={produto.img || produto.imagem || "assets/tube-spinner.svg"}
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
                                        <p className="card-text text-muted small mb-2" style={{ flexGrow: 1 }}>
                                            {produto.descricao ? 
                                                (produto.descricao.length > 50 ? produto.descricao.substring(0, 50) + "..." : produto.descricao) 
                                                : "Sem descrição"}
                                        </p>
                                        <div className="fw-bold fs-5 text-success text-end mb-0">
                                            R$ {Number(produto.preco || 0).toFixed(2).replace('.', ',')}
                                        </div>
                                    </div>
                                </div>
                            </motion.li>
                        );
                    })}
                </motion.ul>
            )}
        </main>
    )
}
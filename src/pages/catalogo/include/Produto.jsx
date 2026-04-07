import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

export default function Produto({produto, handleChangeQuantity, formValue, handleChange, adicionarAoCarrinho}) {
    const [adicionado, setAdicionado] = useState(false);

    const handleAdicionar = () => {
        setAdicionado(true);
        adicionarAoCarrinho();
        setTimeout(() => setAdicionado(false), 2000);
    }

    return (
        <>
            <main className="container-fluid">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    // exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="card rounded-4 overflow-hidden shadow-md">
                        <div className="row m-0 p-0">
                            <div className="col-12 col-md-6 p-0">
                                <div className="card-img"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                >
                                    <img src={produto.imagem || produto.img || "assets/tube-spinner.svg"}
                                        alt={produto.nome}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="card-body col-12 col-md-6 p-0 position-relative flex flex-column justify-between">
                                <div className="flex flex-column flex-shrink-1 p-3 gap-2">
                                    <h5 className="card-title fw-bold text-[2rem]!">{produto.nome}</h5>
                                    <p className="card-text text-muted">{produto.descricao}</p>
                                    <p className="card-text text-success fw-bold text-[1.5rem] md:absolute! md:top-3 md:right-3">R$ {Number(produto.preco || 0).toFixed(2).replace('.', ',')}</p>
                                    
                                    <div className="row m-0 p-0 gap-3 gap-md-0">
                                        <div className="col-12 col-md-6">
                                            <div className="d-flex gap-2">
                                                {/* Círculo que mostra a cor dinamicamente */}
                                                {produto.cores?.map(cor => (
                                                    <motion.div 
                                                        key={cor.id}
                                                        whileHover={{ scale: formValue.cor === cor.hex ? 1 : 1.1 }}
                                                        whileTap={{ scale: formValue.cor === cor.hex ? 1 : 0.9 }}
                                                        className="d-flex flex-column align-items-center cursor-pointer"
                                                        onClick={() => handleChange("cor", cor.hex)}
                                                    >
                                                        <div 
                                                            className={`
                                                                transition-all duration-200 ease-in-out
                                                                ${formValue.cor === cor.hex ? ' shadow-sm' : 'scale-90 opacity-60 hover:opacity-100 '}
                                                            `}
                                                            style={{
                                                                backgroundColor: cor.hex, 
                                                                width: '30px',
                                                                height: '30px',
                                                                borderRadius: '50%',
                                                                marginBottom: '5px',
                                                                border: cor.hex === '#FFFFFF' ? '1px solid #ccc' : 'none'
                                                            }} 
                                                            />
                                                        <span className="text-muted" style={{ fontSize: '10px', fontWeight: formValue.cor === cor.hex ? 'bold' : 'normal', textAlign: 'center', lineHeight: '1.1' }}>
                                                            {cor.name}
                                                        </span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <div className="flex gap-2 md:justify-end">
                                                {produto.tamanho?.map(tamanho => (
                                                    <motion.div 
                                                        whileHover={{ scale: formValue.tamanho === tamanho ? 1 : 1.1 }}
                                                        whileTap={{ scale: formValue.tamanho === tamanho ? 1 : 0.9 }}
                                                        transition={{ duration: 0.2 }}
                                                        onClick={() => handleChange("tamanho", tamanho)}
                                                        className={`
                                                            d-flex flex-column align-items-center justify-content-center
                                                            w-[2.3rem] h-[2.3rem]
                                                            rounded-circle cursor-pointer
                                                            transition-all duration-200 ease-in-out
                                                            ${formValue.tamanho === tamanho ? 'bg-[#9e9e9e] text-white scale-105 shadow-sm' : 'bg-[#e1e1e1] text-dark hover:bg-[#c1c1c1] opacity-50 hover:opacity-100'}
                                                        `} 
                                                        key={tamanho}>
                                                        <span className="fw-semibold text-[0.7rem]">{tamanho}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="w-100 p-3 items-bottom">
                                    <div className="mb-3">
                                        <p className="fw-bold">Quantidade disponível: {produto.quantidade}</p>
                                        <div className="d-flex align-items-center justify-content-between p-1 shadow-sm rounded-full" style={{ backgroundColor: "#e1e1e1" }}>
                                            <motion.button 
                                                whileTap={{ scale: 0.8 }}
                                                className="btn btn-sm btn-light fw-bold rounded-circle d-flex align-items-center justify-content-center"
                                                style={{ width: "32px", height: "32px", border: "1px solid #dee2e6" }} 
                                                onClick={() => handleChangeQuantity(produto.id, -1)}
                                                disabled={formValue.quantidade <= 1}
                                            >
                                                -
                                            </motion.button>
                                            <span className="fw-bold fs-6">{formValue.quantidade}</span>
                                            <motion.button 
                                                whileTap={{ scale: 0.8 }}
                                                className={`btn btn-sm btn-light fw-bold rounded-circle d-flex align-items-center justify-content-center ${formValue.quantidade >= produto.quantidade ? "disabled" : ""}`}
                                                style={{ width: "32px", height: "32px", border: "1px solid #dee2e6" }}
                                                onClick={() => handleChangeQuantity(produto.id, 1)}
                                                disabled={formValue.quantidade >= produto.quantidade}
                                            >
                                                +
                                            </motion.button>
                                        </div>
                                    </div>
                                    <motion.button 
                                        whileHover={adicionado ? {} : { scale: 1.02 }}
                                        whileTap={adicionado ? {} : { scale: 0.98 }}
                                        className="btn w-100 fw-bold border-0 text-white shadow-sm" 
                                        style={{ 
                                            backgroundColor: adicionado ? "#25D366" : "rgba(147, 51, 179, 1)", 
                                            borderRadius: "8px",
                                            transition: "background-color 0.3s ease"
                                        }}
                                        onClick={handleAdicionar}
                                        disabled={formValue.quantidade <= 0 || adicionado}
                                    >
                                        <AnimatePresence mode="wait">
                                            {adicionado ? (
                                                <motion.span
                                                    key="added"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    className="d-flex align-items-center justify-content-center gap-2"
                                                >
                                                    Produto adicionado!
                                                </motion.span>
                                            ) : (
                                                <motion.span
                                                    key="normal"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                >
                                                    Adicionar ao Carrinho
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </motion.button> 
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </>
    )
}
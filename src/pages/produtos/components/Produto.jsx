import { useState } from "react";
import { LayoutGrid, LayoutList, ListFilter, Search } from "lucide-react";
import util from "../../../app/utils.js";
import { useFiltroOrdenacao } from "@hooks/useFiltroOrdenacao";
<<<<<<< HEAD
import { Button, Row, Col, ButtonGroup, Dropdown, Form, InputGroup } from "react-bootstrap";

function Produto({produtos, setModalInfoProduto, setProduto, children}) {
    const [showSearch, setShowSearch] = useState(false);
    const [viewMode, setViewMode] = useState("grid"); // "grid" ou "list"
=======
import { Button, Row, Col, ButtonGroup, Dropdown, Form, Spinner } from "react-bootstrap";
import API from "@app/api";

function Produto({ setModalInfoProduto, setProduto, children }) {

    const { data:produtos, isLoading, error } = API.getProdutos()
    console.log(produtos)
>>>>>>> 899eeb527da3359a1c09a1033bb063df7c7b1359
    
    const camposFiltragem = [
        "nome",
        "categoria.nome",
    { path: "itemEstoque", subCampos: ["marca"] },
  ];

    const {
        filtro,
        setFiltro,
        order,
        dadosProcessados,
<<<<<<< HEAD
        requisitarOrdenacao
    } = useFiltroOrdenacao(produtos, camposFiltragem);

    // Extrai categorias únicas dos produtos para o filtro
    const categoriasUnicas = Array.from(
        new Set(produtos.filter(p => p.categoria?.nome).map(p => p.categoria.nome))
    );
=======
    requisitarOrdenacao,
  } = useFiltroOrdenacao(produtos || [], camposFiltragem);

  if(isLoading) return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }} // Define a altura como 100% da altura da janela (viewport height).
    >
      {/* Componente de Spinner (rodinha girando) do Bootstrap */}
      <Spinner animation="border" variant="primary" />
    </div>
  )

  if (error) {
    return <div>Erro ao carregar produtos</div>;
  }
>>>>>>> 899eeb527da3359a1c09a1033bb063df7c7b1359

    if(!produtos || produtos.length === 0) return (
        <div className="alert alert-roxo mt-4" role="alert" >
            Nenhum produto cadastrado!
        </div>
    )
    const getEstoqueBadge = (estoque) => {
        const quantidade = estoque || 0;
        if (quantidade >= 10) {
        // Estoque alto: verde
        return <span className="badge bg-success">Estoque Alto</span>;
        } else if (quantidade >= 5) {
        // Estoque médio: amarelo
        return <span className="badge bg-warning text-dark">Estoque Médio</span>;
        } else if (quantidade > 0) {
        // Estoque baixo: laranja
        return <span className="badge bg-danger">Estoque Baixo</span>;
        } else {
        // Fora de estoque: cinza
        return <span className="badge bg-secondary">Fora de Estoque</span>;
        }
    };

    console.log(dadosProcessados)
    return (
        <>
            {/* <div>
                <h4 className="mb-3">Total de Produtos: {produtos.length}</h4>
                <hr />
                <p className="text-muted">Gerencie seus produtos com facilidade.</p>
                <button className="btn btn-roxo">Adicionar Produto</button>
                <button className="btn btn-secondary ms-2">Exportar Lista</button>
                <button className="btn btn-secondary ms-2">Filtrar Produtos</button>
            </div> */}
            <div className="mb-4 row d-flex flex-wrap gap-md-0 gap-sm-2 gap-2 p-0">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="h5 text-center fw-normal m-0">Produtos</div>
                    <div className="d-flex gap-3 align-items-center">
<<<<<<< HEAD
                        <div className="d-flex align-items-center position-relative">
                            {/* Barra de Pesquisa Expansível */}
                            {showSearch && (
                                <Form.Control
                                    type="text"
                                    placeholder="Pesquisar produto..."
                                    value={filtro}
                                    onChange={(e) => setFiltro(e.target.value)}
                                    autoFocus
                                    className="me-2 shadow-sm"
                                    style={{
                                        width: "200px",
                                        transition: "width 0.3s ease-in-out",
                                        borderRadius: "20px"
                                    }}
                                />
                            )}
                            <Button 
                                size="sm" 
                                variant="" 
                                onClick={() => {
                                    if(showSearch && !filtro) {
                                        setShowSearch(false);
                                    } else {
                                        setShowSearch(true);
                                    }
                                }}
                                className="d-flex align-items-center justify-content-center p-1 rounded-circle border-0"
                                style={{ width: "32px", height: "32px" }}
                            >
                                <Search size={15} color={filtro || showSearch ? "var(--bs-primary)" : "currentColor"} />
                            </Button>
                        </div>
                        <Dropdown>
                            <style>{`
                                .custom-dropdown-filter {
                                    width: 260px !important;
                                    min-width: 260px !important;
                                }
                            `}</style>
                            <Dropdown.Toggle variant="" className="dropdown-toggle-hidden-arrow d-flex justify-content-center align-items-center">
                                <ListFilter size={15} />
                            </Dropdown.Toggle>
                            {/* override css garante que Popper.js ou estilos globais não esmagarão o Menu para a largura do Toggle */}
                            <Dropdown.Menu className="shadow p-3 custom-dropdown-filter">
                                <div className="d-flex flex-column gap-3">
                                    <Form.Group>
                                        <Form.Label className="small fw-bold text-muted mb-1">Filtrar Categoria</Form.Label>
                                        <Form.Select 
                                            size="sm"
                                            value={filtro}
                                            onChange={(e) => setFiltro(e.target.value)}
                                            className="cursor-pointer w-100"
                                        >
                                            <option value="">Todas as Categorias</option>
                                            {categoriasUnicas.map((cat, index) => (
                                                <option key={index} value={cat}>{cat}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label className="small fw-bold text-muted mb-1">Ordenar por</Form.Label>
                                        <Form.Select 
                                            size="sm"
                                            value={order.chave}
                                            onChange={(e) => requisitarOrdenacao(e.target.value)}
                                            className="cursor-pointer w-100"
                                        >
                                            <option value="id">ID</option>
                                            <option value="nome">Nome do Produto</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>
=======
                        <div>
                            <Button size="sm" variant="" ><Search size={15} /></Button>
                                    </div>
                                    <Dropdown>
                            <Dropdown.Toggle variant="" className="dropdown-toggle-hidden-arrow d-flex justify-content-center align-items-center">
                                <ListFilter size={15} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Row className="m-0 p-0">
                                            <Col xs={12}>
                                        <Form.Group>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="">
                                                    Filtrar por: 
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>

                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="">
                                                    Ordenar por: {order.chave}        
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => requisitarOrdenacao("id")}>
                                                        <Dropdown.ItemText>id</Dropdown.ItemText>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => requisitarOrdenacao("nome")}>
                                                        <Dropdown.ItemText>Nome</Dropdown.ItemText>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <Dropdown.ItemText>Nome</Dropdown.ItemText>
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Form.Group>
                                    </Col>
                                </Row>
>>>>>>> 899eeb527da3359a1c09a1033bb063df7c7b1359
                            </Dropdown.Menu>
                        </Dropdown>
                        <ButtonGroup>
                            <Button 
                                size="sm" 
                                variant={viewMode === "grid" ? "secondary" : "outline-secondary"}
                                onClick={() => setViewMode("grid")}
                            >
                                <LayoutGrid size={15} />
                            </Button>
                            <Button 
                                size="sm" 
                                variant={viewMode === "list" ? "secondary" : "outline-secondary"}
                                onClick={() => setViewMode("list")}
                            >
                                <LayoutList size={15} />
                            </Button>
                        </ButtonGroup>
                        {children}
                    </div>
                </div>
                {/* <div className="d-flex justify-content-center">
                    <h1 className="h4">Filtrar por:</h1>
                </div>
                <div className="col-md-8 col-sm-12">
                    <input type="text" className="form-control h-100" placeholder="Buscar produtos..." value={filtro} onChange={(e) => setFiltro(e.target.value)}  />
                </div>
                <div className="col-md-4 col-sm-12 d-flex gap-3">
                    <button className="btn btn-secondary w-50">Buscar</button>
                    <button className="btn btn-secondary w-50">Limpar Filtros</button>
                </div> */}
            </div>

            {/* Alternar Visualização entre Grid e List */}
            {viewMode === "grid" ? (
                <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 align-items-stretch h-100 g-4 mb-4">
                {
                    dadosProcessados.map(produto => (
                    <div className="col" key={produto.id} onClick={() => {setModalInfoProduto(true); setProduto(produto)}}>
                        <div className="card produto-card shadow-sm cursor-pointer border-0">
                        <div className="produto-img-wrapper" style={{ display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
                            <img
                            className="card-img-top produto-img"
                            src={produto.img || "src/assets/tube-spinner.svg"}
                            alt={produto.nome}
                            style={{ objectFit: "contain", height: "100%", width: "100%", padding: "0.5rem" }}
                            />
                        </div>
                        <div className="card-body p-2">
                            <h5 className="card-title text-truncate" title={produto.nome}>{produto.nome}</h5>
                            <p className="card-text text-muted small">{util.capitalize(produto.descricao, 50)}</p>
                        </div>
                        <div className="card-footer bg-transparent row border-top-0 d-flex justify-content-between align-items-center p-2 mb-0 mt-auto">
                            <div className="col-6 d-flex flex-wrap gap-1 justify-content-start align-items-end p-0 ps-2">
                            <span className="fw-bold fs-5">{produto.itemEstoque?.length || `0`}</span>
                            <span className="text-muted small"> unidades</span>
                            </div>
                            <div className="col-6 d-flex justify-content-end align-items-center h-100 p-0 pe-2 text-end">
                            {getEstoqueBadge(produto.itemEstoque?.length)}
                            </div>
                        </div>
                        </div>
                    </div>
                    ))
                }
                </div>
            ) : (
                <div className="table-responsive bg-white rounded shadow-sm mb-4">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Produto</th>
                                <th>Categoria</th>
                                <th>Descrição</th>
                                <th className="text-center">Quantidade</th>
                                <th className="text-center">Status Estoque</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dadosProcessados.map(produto => (
                                <tr key={produto.id} onClick={() => {setModalInfoProduto(true); setProduto(produto)}} style={{ cursor: "pointer" }}>
                                    <td>{produto.id}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-3">
                                            <img 
                                                src={produto.img || "src/assets/tube-spinner.svg"} 
                                                alt={produto.nome}
                                                className="rounded object-fit-contain bg-light"
                                                style={{ width: "40px", height: "40px" }}
                                            />
                                            <span className="fw-bold">{produto.nome}</span>
                                        </div>
                                    </td>
                                    <td>{produto.categoria?.nome || "-"}</td>
                                    <td className="text-muted small text-truncate" style={{ maxWidth: "250px" }}>
                                        {util.capitalize(produto.descricao, 50)}
                                    </td>
                                    <td className="text-center fw-bold text-roxo">{produto.itemEstoque?.length || 0}</td>
                                    <td className="text-center">{getEstoqueBadge(produto.itemEstoque?.length)}</td>
                                </tr>
                            ))}
                            {dadosProcessados.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">
                                        Nenhum produto encontrado com os filtros atuais.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}
                            // <div key={produto.id} onClick={() => deleteProduto(produto.id)} className="container bg-danger">
                            //     <ul>
                            //         <li>{produto.nome}</li>
                            //         <li>{produto.descricao}</li>
                            //         <li>{produto.tamanho}</li>
                            //         <li>{produto.cor}</li>
                            //         <li>{produto.img}</li>
                            //         <li>{produto.valor_venda}</li>
                            //         <li>{produto.valor_compra}</li>
                            //         <li>{produto.estoque_atual}</li>
                            //         <li>{produto.codigo_barras}</li>
                            //         <li>{produto.categoria_id}</li>
                            //     </ul>
                            // </div>

export default Produto
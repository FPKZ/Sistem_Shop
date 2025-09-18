import { Container, Card, Row, Col, Badge } from "react-bootstrap"
import util from "../../../app/utils.js"

export default function TabelaProdutos({mobile, produto, setItemEstoque, width}){
    if(!produto || produto === null || produto === undefined) return
    console.log(produto)
    return(
        <>
            {/* Lista de Produtos */}
            <Col md={width} className={`order-md-1 order-2 m-0 p-0 d-flex flex-column border ${mobile ? "" : "h-100"}`}>
                {/* Cabeçalho Fixo */}
                <Row className="g-0 p-2 m-0 border-bottom position-sticky top-0 bg-light" style={{zIndex: 1}}>
                    <Col xs={1}><strong>Id</strong></Col>
                    <Col xs={2}><strong>Img</strong></Col>
                    <Col xs={3}><strong>Nome</strong></Col>
                    <Col xs={2}><strong>Compra</strong></Col>
                    <Col xs={2}><strong>Venda</strong></Col>
                    <Col xs={2}><strong>Status</strong></Col>
                </Row>

                {/* Container dos Cards com Rolagem */}
                <div className={`flex-grow-1 p-2 overflow-hidden ${mobile ? "" : "overflow-y-auto"}`}>
                <Produtos produtos={produto} setItemEstoque={setItemEstoque} />
                </div>
            </Col>
        </>
    )
}

function Produtos({ produtos, setItemEstoque }) {
  //console.log(produtos)
  if(!produtos) return
  const itens = produtos.itemEstoque;

  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Disponivel':
        return <Badge bg="success">{status}</Badge>;
      case 'Reservado':
        return <Badge bg="warning">{status}</Badge>;
      case 'Vendido':
        return <Badge bg="danger">{status}</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <Container fluid className="p-0 m-0 pt-3 ">
        {itens.map((produto) => (
          <Card
            key={produto.id}
            className={`alert p-0
                      ${produto.status === "Disponivel" ? "alert-light" : ""}
                      ${produto.status === "Vendido" ? "alert-danger" : ""} 
                      ${produto.status === "Reservado" ? "alert-warning" : ""}`}
            onClick={() => setItemEstoque(produto)}
            style={{cursor: 'pointer'}}
          >
            <Card.Body className="p-0">
              <Row className="px-2 py-1">
                <Col xs={1} className="pe-2 m-0 text-center d-flex align-items-center">
                  <strong >{produto.id}</strong>
                </Col>
                <Col xs={2} className="p-0">
                  <img
                    src={produto.img || "src/assets/la-pimienta-sado-tornozeleiras-tiras-amarrar-120-m-9199.jpg"}
                    alt={produto.nome}
                    className="img-fluid rounded"
                    style={{maxHeight: "40px"}}
                  />
                </Col>
                <Col xs={3} className="p-2 m-0 text-truncate d-flex align-items-center">
                  <span>
                    {produto.nome}
                  </span>
                </Col>
                <Col xs={2} className="p-0 m-0 d-flex align-items-center">
                  <span>
                    {util.formatMoney(produto.valor_compra)}
                  </span>
                </Col>
                <Col xs={2} className="p-0 m-0 d-flex align-items-center">
                  <span>
                    {util.formatMoney(produto.valor_venda)}
                  </span>
                </Col>
                <Col xs={2} className="p-0 m-0 d-flex align-items-center">
                  <span>
                    {getStatusBadge(produto.status)}
                  </span>
                </Col>
                {/* <div className="col-1  end-0 d-flex flex-wrap gap-2 p-1">
                              <button className="btn btn-outline-danger" type="button"><i className="bi bi-trash3"></i></button>
                              <button className="btn btn-outline-secondary" type="button"><i className="bi bi-three-dots"></i></button>
                          </div> */}
              </Row>
            </Card.Body>
          </Card>
        ))}
    </Container>
  );
}
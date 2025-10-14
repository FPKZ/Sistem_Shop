import { Container, Card, Row, Col, Badge, Button, ButtonGroup, OverlayTrigger, Tooltip} from "react-bootstrap"
import util from "@app/utils.js"

export default function TabelaProdutos({mobile, produto, deleteList, width, custom, setmodalInfoProduto, setProduto}){
    if(!produto || produto === null || produto === undefined || produto.length === 0) return
    //console.log(produto)
    return(
        <>
            {/* Lista de Produtos */}
            <Col md={width} className={`order-md-1 order-2 m-0 p-0 d-flex flex-column border  ${custom} ${mobile ? "" : "h-100"}`}>
                {/* Cabeçalho Fixo */}
                <Row className="g-0 p-2 m-0 border-bottom position-sticky top-0 bg-light" style={{zIndex: 1}}>
                    <Col xs={1}><strong>Id</strong></Col>
                    <Col xs={1} sm={1}><strong>Img</strong></Col>
                    <Col xs={3} sm={3}><strong>Nome</strong></Col>
                    <Col xs={2} sm={3}><strong>Marca</strong></Col>
                    <Col xs={3} sm={2}><strong>Venda</strong></Col>
                    <Col xs={2} className="pe-4 d-flex justify-content-end"><strong>Ação</strong></Col>
                </Row>

                {/* Container dos Cards com Rolagem */}
                <div className={`flex-grow-1 p-0 overflow-hidden ${mobile ? "" : "overflow-y-auto"}`}>
                <Produtos produtos={produto} deleteList={deleteList} setProduto={setProduto}  setmodalInfoProduto={setmodalInfoProduto} />
                </div>
            </Col>
        </>
    )
}

function Produtos({ produtos, deleteList, setmodalInfoProduto, setProduto }) {
  //console.log(produtos)
  if(!produtos) return
  const itens = produtos;

  
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
    <Container fluid className="d-flex flex-column p-1 m-0 gap-2">
        {itens?.map((produto) => (
          <Card
            key={produto.id}
            className={`alert p-0 m-0
                      ${produto.status === "Disponivel" ? "alert-light" : ""}
                      ${produto.status === "Vendido" ? "alert-danger" : ""} 
                      ${produto.status === "Reservado" ? "alert-warning" : ""}`}
            onClick={() => {
              console.log(produto)
            }}
            style={{cursor: 'pointer'}}
          >
            <Card.Body className="p-0 overflow-hidden">
              <Row className="px-2 py-1">
                <Col xs={1} className="pe-2 m-0 text-center d-flex align-items-center">
                  <strong >{produto.id}</strong>
                </Col>
                <Col xs={1} sm={1} className="p-0 d-flex">
                  <img
                    src={!produto.produto.img || "src/assets/tube-spinner.svg"}
                    alt={produto.nome}
                    className="img-fluid rounded"
                    style={{maxHeight: "40px"}}
                  />
                </Col>
                <Col xs={3} sm={3} className="p-2 m-0 text-truncate d-flex align-items-center">
                  <span>
                    {produto.nome}
                  </span>
                </Col>
                <Col xs={2} sm={3} className="p-2 m-0 text-truncate d-flex align-items-center">
                  <span>
                    {produto.marca}
                  </span>
                </Col>
                <Col xs={3} sm={2} className="p-0 m-0 d-flex align-items-center">
                  <span>
                    {util.formatMoney(produto.valor_venda)}
                  </span>
                </Col>
                <Col xs={2} className="p-0 pe-3 m-0 d-flex align-items-center justify-content-end">
                    <ButtonGroup size="sm">
                        <OverlayTrigger
                            placement="top"
                            overlay={
                                <Tooltip>Retirar item</Tooltip>
                            }
                        >
                            <Button variant="outline-danger" size="sm" onClick={() => deleteList?.(produto.id)}><i className="bi bi-trash3"></i></Button>
                        </OverlayTrigger>
                        {/* <Button variant="outline-secondary" size="sm" onClick={() => {
                            setmodalInfoProduto?.(true)
                            setProduto?.(produto)
                        }}><i className="bi bi-three-dots"></i></Button> */}
                    </ButtonGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
    </Container>
  );
}
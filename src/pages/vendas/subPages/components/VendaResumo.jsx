import { Card, Button, Row, Col, Form } from "react-bootstrap";
import utils from "@services/utils";
import { Trash2, Pencil } from "lucide-react";

export function VendaResumo({
  cliente,
  listaVenda,
  pagamentos,
  handleRemoverPagamento,
  handleEditarPagamento,
  setShowModalPagamento,
  calcularSubtotal,
  displayDesconto,
  handleDescontoChange,
  calcularTotalComDesconto,
  sobra,
  handleFinalizarVenda,
  handleCancelarVenda,
  isLoading,
  reservar,
  prazoReserva,
  setPrazoReserva,
}) {
  const prazos = [
    { label: "1 Dia", value: 1 },
    { label: "3 Dias", value: 3 },
    { label: "7 Dias", value: 7 },
    { label: "15 Dias", value: 15 },
    { label: "30 Dias", value: 30 },
  ];

  return (
    <Card className="border-0 shadow-sm sticky-top" style={{ top: "20px" }}>
      <Card.Header className="bg-white border-0 py-3">
        <h5 className="mb-0">
          {reservar ? "Resumo da Reserva" : "Resumo da Venda"}
        </h5>
      </Card.Header>
      <Card.Body>
        {!reservar ? (
          <>
            {pagamentos.map((pagamento, index) => (
              <Row
                key={index}
                className={
                  index === pagamentos.length - 1 ? "" : "mb-2 border-bottom"
                }
              >
                <Col md={11} className="flex flex-column pe-4">
                  {pagamento.forma_pagamento !== "Dinheiro" && (
                    <Col
                      md={12}
                      className="flex align-items-center justify-content-between"
                    >
                      {pagamento.forma_pagamento === "Promissória" ? (
                        <div>
                          <small className="text-muted">
                            Data de Pagamento
                          </small>
                          <div className="fw-bold">
                            {utils.formatDate(pagamento.data_pagamento)}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <small className="text-muted">Código</small>
                          <div className="fw-bold">
                            {pagamento.codigo_pagamento}
                          </div>
                        </div>
                      )}

                      {pagamento.parcelas && (
                        <div className="text-end">
                          <small className="text-muted">Parcelas</small>
                          <div className="fw-bold">{pagamento.parcelas}</div>
                        </div>
                      )}
                    </Col>
                  )}
                  <Col
                    md={6}
                    className="flex align-items-center justify-content-between w-100"
                  >
                    <div className="mb-2">
                      <small className="text-muted">Forma de Pagamento</small>
                      <div className="fw-bold">{pagamento.forma_pagamento}</div>
                    </div>
                    <div className="mb-2 text-end">
                      <small className="text-muted">Valor</small>
                      <div className="fw-bold">
                        {utils.formatMoney(pagamento.valor_nota)}
                      </div>
                    </div>
                  </Col>
                </Col>
                <Col
                  md={1}
                  className="flex flex-column gap-1 py-2 align-items-end justify-content-center text-center"
                >
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemoverPagamento(index)}
                  >
                    <Trash2 size={14} />
                  </Button>
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() =>
                      handleEditarPagamento(index, () =>
                        setShowModalPagamento(true),
                      )
                    }
                  >
                    <Pencil size={14} />
                  </Button>
                </Col>
              </Row>
            ))}

            <Button
              className="w-100 mb-2"
              variant="outline-primary"
              onClick={() => setShowModalPagamento(true)}
              disabled={
                !cliente ||
                listaVenda.length === 0 ||
                calcularTotalComDesconto() === 0 ||
                sobra <= 0
              }
            >
              <i className="bi bi-plus-circle me-2"></i>
              Adicionar Forma de Pagamento
            </Button>
          </>
        ) : (
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold text-muted small">
              Prazo de Reserva
            </Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {prazos.map((prazo) => (
                <Button
                  key={prazo.value}
                  variant={
                    prazoReserva === prazo.value
                      ? "primary"
                      : "outline-secondary"
                  }
                  size="sm"
                  className="rounded-pill px-3"
                  onClick={() => setPrazoReserva(prazo.value)}
                >
                  {prazo.label}
                </Button>
              ))}
            </div>
            <Form.Text className="text-muted mt-2 d-block">
              O produto ficará reservado até o dia{" "}
              <span className="fw-bold">
                {utils.formatDate(
                  new Date(
                    new Date().getTime() + prazoReserva * 24 * 60 * 60 * 1000,
                  ),
                )}
              </span>
            </Form.Text>
          </Form.Group>
        )}

        <hr />

        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">Subtotal:</span>
          <span className="fw-bold">
            {utils.formatMoney(calcularSubtotal())}
          </span>
        </div>

        {!reservar && (
          <Form.Group className="mb-3">
            <Form.Label>Desconto</Form.Label>
            <Form.Control
              type="text"
              value={displayDesconto}
              onChange={handleDescontoChange}
              placeholder="R$ 0,00"
            />
          </Form.Group>
        )}

        <hr />

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Total:</h5>
          <h3 className="mb-0 text-primary">
            {utils.formatMoney(calcularTotalComDesconto())}
          </h3>
        </div>

        <Button
          variant={reservar ? "warning" : "primary"}
          size="lg"
          className="w-100 fw-bold"
          onClick={handleFinalizarVenda}
          disabled={
            !cliente ||
            listaVenda.length === 0 ||
            (!reservar && (pagamentos.length === 0 || sobra !== 0)) ||
            isLoading
          }
        >
          <i
            className={`bi ${reservar ? "bi-calendar-check" : "bi-check-circle"} me-2`}
          ></i>
          {reservar ? "Realizar Reserva" : "Finalizar Venda"}
        </Button>

        <Button
          variant="outline-secondary"
          className="w-100 mt-2"
          onClick={handleCancelarVenda}
        >
          Cancelar
        </Button>
      </Card.Body>
    </Card>
  );
}

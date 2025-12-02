import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import utils from "@app/utils";

export default function ModalAdicionarPagamento({
  show,
  onHide,
  valorTotal,
  onAdd,
  pagamentoEdit,
  total
}) {
  const [formaPagamento, setFormaPagamento] = useState("Dinheiro");
  const [valorPagamento, setValorPagamento] = useState();
  const [codigoPagamento, setCodigoPagamento] = useState("");
  const [parcelas, setParcelas] = useState("");
  const [dataPagamento, setDataPagamento] = useState("");
  const [index, setIndex] = useState();

  useEffect(() => {
    if (pagamentoEdit) {
      setValorPagamento(pagamentoEdit.valor_pagamento);
      setFormaPagamento(pagamentoEdit.forma_pagamento);
      setCodigoPagamento(pagamentoEdit.codigo_pagamento);
      setParcelas(pagamentoEdit.parcelas);
      setDataPagamento(pagamentoEdit.data_pagamento);
      setIndex(pagamentoEdit.index);
      console.log(pagamentoEdit)
    } else {
      setValorPagamento(valorTotal);
      setFormaPagamento("Dinheiro");
      setCodigoPagamento("");
      setParcelas(1);
      setDataPagamento(new Date().toLocaleDateString("pt-BR"));
      setIndex(null);
    }
  }, [show, onHide, pagamentoEdit]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name === "forma_pagamento") setFormaPagamento(value);
    if (name === "valor_pagamento") {
      let newValue = parseFloat(value);
      if (index !== undefined && index !== null) {
        newValue >= total ? newValue = total : newValue = newValue
      } else {
        if (newValue > valorTotal) {
          newValue = valorTotal;
        }
      }
      setValorPagamento(newValue);
    }
    if (name === "codigo_pagamento") setCodigoPagamento(value);
    if (name === "parcelas") setParcelas(value);
    if (name === "data_pagamento") setDataPagamento(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let pagamento = {};

    switch (formaPagamento) {
      case "Dinheiro":
        pagamento = {
          forma_pagamento: formaPagamento,
          valor_pagamento: valorPagamento,
          data_pagamento: new Date(),
        };
        break;
      case "Cartão de Crédito":
        pagamento = {
          forma_pagamento: formaPagamento,
          valor_pagamento: valorPagamento,
          codigo_pagamento: codigoPagamento,
          parcelas: parcelas,
          data_pagamento: new Date(),
        };
        break;
      case "Promissória":
        pagamento = {
          forma_pagamento: formaPagamento,
          valor_pagamento: valorPagamento,
          parcelas: parcelas,
          data_pagamento: dataPagamento,
        };
        break;
      default:
        pagamento = {
          forma_pagamento: formaPagamento,
          valor_pagamento: valorPagamento,
          codigo_pagamento: codigoPagamento,
          data_pagamento: new Date(),
        };
        break;
    }

    if(index !== undefined && index !== null){
      pagamento = { ...pagamento, index }
    }
    onAdd(pagamento);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <ModalHeader>Adicionar Pagamento</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formFormaPagamento">
            <Form.Label>Forma de Pagamento</Form.Label>
            <Form.Select
              name="forma_pagamento"
              value={formaPagamento}
              onChange={handleChange}
            >
              <option value="Dinheiro">Dinheiro</option>
              <option value="Pix">Pix</option>
              <option value="Cartão de Crédito">Cartão de Crédito</option>
              <option value="Cartão de Débito">Cartão de Débito</option>
              <option value="Promissória">Promissória</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formValorPagamento">
            <Form.Label>Valor do Pagamento</Form.Label>
            <Form.Control
              type="number"
              name="valor_pagamento"
              placeholder="0,00"
              value={valorPagamento}
              onChange={handleChange}
              onFocus={() => setValorPagamento("")}
              step="0.01"
              min="0"
              max={valorTotal}
            />
          </Form.Group>

          {formaPagamento !== "Dinheiro" && (
            <>
              {formaPagamento !== "Promissória" && (
                <Form.Group className="mb-3" controlId="formCodigoPagamento">
                  <Form.Label>Código do Pagamento</Form.Label>
                  <Form.Control
                    type="text"
                    name="codigo_pagamento"
                    placeholder="Ex: 12345"
                    value={codigoPagamento}
                    onChange={handleChange}
                  />
                </Form.Group>
              )}
              
              {(formaPagamento === "Cartão de Crédito" || formaPagamento === "Promissória") && (
                <>
                  <Form.Group className="mb-3" controlId="formParcelas">
                    <Form.Label>Parcelas</Form.Label>
                    <Form.Select
                      name="parcelas"
                      value={parcelas}
                      onChange={handleChange}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        (parcela) => (
                          <option key={parcela} value={parcela}>
                            x{parcela}
                          </option>
                        )
                      )}
                    </Form.Select>
                  </Form.Group>

                  {formaPagamento === "Promissória" && (
                    <Form.Group className="mb-3" controlId="formDataPagamento">
                      <Form.Label>Data do Pagamento</Form.Label>
                      <Form.Control
                        type="date"
                        name="data_pagamento"
                        value={dataPagamento}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  )}

                </>
              )}
            </>
          )}

          {/* A submit button is needed inside the form for accessibility and proper form submission handling.
                        It can be hidden if the main submit button is in the footer. */}
          <Button type="submit" style={{ display: "none" }}></Button>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Adicionar
        </Button>
      </ModalFooter>
    </Modal>
  );
}

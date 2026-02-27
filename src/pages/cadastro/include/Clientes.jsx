import { useNavigate } from "react-router-dom";
import { Button, Col } from "react-bootstrap";
import { useCadastroCliente } from "@hooks/clientes/useCadastroCliente";

export default function Clientes() {
  const navigate = useNavigate();

  const {
    formValue,
    erros,
    validated,
    isLoading,
    handleChange,
    handleSubimit,
  } = useCadastroCliente(navigate);

  return (
    <>
      <form onSubmit={handleSubimit} noValidate className="">
        <div className="row p-3 pt-0 m-0 gap-4">
          <Col md={12} className="p-0">
            <label htmlFor="nome" className="form-label">
              Nome
            </label>
            <input
              type="text"
              className={`form-control ${
                validated ? (erros.nome ? `is-invalid` : `is-valid`) : ""
              }`}
              id="nome"
              name="nome"
              value={formValue.nome || ""}
              onChange={handleChange}
              placeholder="Nome"
              required
            />
          </Col>
          <Col md={4} className="p-0">
            <label htmlFor="email" className="form-label">
              E-mail
            </label>
            <input
              type="email"
              className={`form-control`}
              id="email"
              name="email"
              value={formValue.email || ""}
              onChange={handleChange}
              placeholder="E-mail"
            />
          </Col>
          <Col className="p-0">
            <label htmlFor="tell" className="form-label">
              Telefone
            </label>
            <input
              type="tel"
              className={`form-control ${
                validated ? (erros.telefone ? `is-invalid` : `is-valid`) : ""
              }`}
              id="tell"
              name="telefone"
              value={formValue.telefone || ""}
              onChange={handleChange}
              placeholder="Telefone"
              required
            />
          </Col>
          <Col md={5} className="p-0">
            <label htmlFor="endereco" className="form-label">
              Endereço
            </label>
            <input
              type="text"
              className={`form-control`}
              id="endereco"
              name="endereco"
              placeholder="Endereco"
            />
          </Col>
          <Button
            variant="outline-secondary"
            className="btn btn-roxo"
            disabled={isLoading}
            type="submit"
          >
            Adicionar
          </Button>
        </div>
      </form>
    </>
  );
}

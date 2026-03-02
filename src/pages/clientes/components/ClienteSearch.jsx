import { Row, Col, InputGroup, Form, Button } from "react-bootstrap";
import { Search } from "lucide-react";

export function ClienteSearch({ filtro, setFiltro, onClear }) {
  return (
    <Row className="mb-4 g-3">
      <Col md={10}>
        <InputGroup className="grow h-100 rounded-4">
          <InputGroup.Text>
            <Search size={16} className="text-muted" />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Buscar por nome, telefone..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="border-start-0"
          />
        </InputGroup>
      </Col>
      <Col md={2}>
        <Button className="btn-roxo w-100" onClick={onClear}>
          Limpar Filtros
        </Button>
      </Col>
    </Row>
  );
}

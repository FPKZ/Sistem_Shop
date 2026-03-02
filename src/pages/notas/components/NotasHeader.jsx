import { Row, Col, Button } from "react-bootstrap";
import { Plus } from "lucide-react";
import HoverBtn from "@components/HoverBtn";

export function NotasHeader({ mobile, setIsModalCadastroOpen }) {
  return (
    <Row className="mb-4 align-items-center position-relative">
      <Col xs={9}>
        <h2 className="h3 mb-1">Notas Fiscais</h2>
        <p className="text-muted mb-0">
          Gerencie e acompanhe suas notas fiscais em um só lugar.
        </p>
      </Col>
      <Col
        xs={3}
        className="d-flex justify-content-end position-relative overflow-visible h-100"
      >
        {mobile ? (
          <HoverBtn
            mobile={mobile}
            func={setIsModalCadastroOpen}
            upClass="position-absolute bottom-0"
          >
            Cadastrar Nota
          </HoverBtn>
        ) : (
          <Button
            className="btn btn-roxo d-flex align-items-center"
            onClick={() => setIsModalCadastroOpen(true)}
          >
            <Plus size={18} className="me-2" />
            Cadastrar Nota
          </Button>
        )}
      </Col>
    </Row>
  );
}

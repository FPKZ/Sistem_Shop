import { Row, Col, Button } from "react-bootstrap";
import { Plus } from "lucide-react";
import HoverBtn from "@components/HoverBtn";
import { useNavigate } from "react-router-dom";

import { usePermissoes } from "@hooks/auth/usePermissoes";

export function NotasHeader({ mobile }) {
  const navigate = useNavigate();
  const { pode } = usePermissoes();
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
        {pode("cadastrarNotas") && 
          mobile ? (
            <HoverBtn
              mobile={mobile}
              func={() => navigate("/cadastro/nota")}
              upClass="position-absolute bottom-0"
            >
              Cadastrar Nota
            </HoverBtn>
          ) : (
            <Button
              className="btn btn-roxo d-flex align-items-center"
              onClick={() => navigate("/cadastro/nota")}
            >
              <Plus size={18} className="me-2" />
              Cadastrar Nota
            </Button>
          )
        }
      </Col>
    </Row>
  );
}

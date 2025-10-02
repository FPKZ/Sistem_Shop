import { Row, Col, Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Devolocao() {
  const navigate = new useNavigate();

  return (
    <>
      <div className="d-flex justify-content-center flex-wrap flex-md-nowrap align-items-center  pb-3 mb-3 border-bottom position-relative">
        <Button
          className="btn btn-roxo position-absolute start-0"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-chevron-left"></i>
        </Button>
        <h1 className="h3 m-0">Devolução</h1>
      </div>
    </>
  );
}

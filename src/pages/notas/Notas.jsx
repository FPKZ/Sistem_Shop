import { Modal, Row, Col, ButtonGroup, Button, ProgressBar, Card, Form, Alert, Container, Table, Badge } from "react-bootstrap";
import { Eye, BookOpen, Edit, MapPin } from "lucide-react"
import { useEffect, useState } from "react";
import API from "../../components/app/api.js"
import TraineesModule from "./Components/Table.jsx"

function Notas() {
  const [notas, setNotas] = useState([])

  useEffect(() => {
    getNotas()
  }, [])

  const getNotas = async () => {
    const n = await API.getNotas()
    console.log(n)
    setNotas(n)
  }

  

  return (
    <>
      <Container fluid>
        <Col md={12} className="d-flex justify-content-between border-bottom p-3 mb-3">
          <h2>Notas</h2>
          <Button>
            Adicionar Nota
          </Button>
        </Col>
        <TraineesModule notas={notas}></TraineesModule>
      </Container>
    </>
  );
}
export default Notas;

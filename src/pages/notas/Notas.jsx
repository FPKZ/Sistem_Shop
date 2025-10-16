import { 
  Table, 
  Card, 
  Badge, 
  Button, 
  ButtonGroup, 
  ProgressBar, 
  Form, 
  Row, 
  Col,
  Modal
} from 'react-bootstrap';
import { 
  GraduationCap, 
  User, 
  MapPin, 
  BookOpen, 
  Award, 
  Plus, 
  Edit, 
  Eye, 
  UserCheck, 
  Download, 
  ArrowUpDown 
} from 'lucide-react';
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import API from "@app/api"
import HoverBtn from "@components/HoverBtn"
import CadastroNotaModal from "@components/modal/CadastroNota/CadastroNotaModal";
import TableNota from "./include/TableNota"
import ModalNota from "./include/ModalNota"

function Notas() {
  const [notas, setNotas] = useState([])
  const [selectNota, setselectNota] = useState(null);
  const [isModalOpem, setisModalOpem] = useState(false);
  const [modalCadastroNota, setModalCadastroNota] = useState(false)

  const { mobile } = useOutletContext()

  const navigate = useNavigate()
  
  

  useEffect(() => {
    getNotas()
  }, [])

  const getNotas = async () => {
    const n = await API.getNotas()
    // console.log(n)
    setNotas(n)
  }
  // console.log(selectNota)
  return (
    <div className="p-2 p-md-4">
      <div className="d-flex justify-content-center flex-wrap flex-md-nowrap align-items-center  pb-3 mb-3 border-bottom position-relative">
          <Button className="btn btn-roxo position-absolute start-0" onClick={() => navigate("/")}>
              <i className="bi bi-chevron-left"></i>
          </Button>
          <h1 className="h3 m-0">Notas</h1>
          <HoverBtn upClass={'position-absolute end-0'} func={setModalCadastroNota} mobile={mobile} >Adicionar Nota</HoverBtn>
      </div>
      {/* Main Table */}
      <TableNota notas={notas} setselectNota={setselectNota} setisModalOpem={setisModalOpem} />
      
      {/* Profile Modal */}
      <ModalNota visible={isModalOpem} onClose={() => setisModalOpem(false)} mobile={mobile} selectNota={selectNota} />
      {
        modalCadastroNota && (
          <CadastroNotaModal visible={modalCadastroNota} onClose={() => setModalCadastroNota(false)} produts={true} fullScrean={true}/>
        )
      }
    </div>
  );
}
export default Notas;

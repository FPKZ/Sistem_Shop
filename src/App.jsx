import { useNavigate } from "react-router-dom";
import { Card } from "@components/Card"

function App() {
  const navigate = useNavigate();
  
  return (
    <div className="p-2 p-md-3">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 m-sm- border-bottom">
        <h1 className="h2">Dashbord</h1>
        <div className="fold"></div>
        <div className="fold"></div>
        <div className="fold"></div>
      </div>
      <h1 className="h4 mb-4">Atalhos</h1>
      <div className="row g-2 g-sm-4">
          <Card icon="plus-square-fill" location={() => navigate(`cadastro`)}>Cadastro</Card>
          <Card icon="bag-fill" location={() => navigate(`vendas`)}>Vendas</Card>
          <Card icon="grid-fill" location={() => navigate(`produtos`)}>Produtos</Card>
          <Card icon="journal-bookmark-fill" location={() => navigate(`clientes`)}>Clientes</Card>
          <Card icon="upc" location={() => navigate(`notas`)}>Notas</Card>
      </div>
    </div>
  );
}



export default App;

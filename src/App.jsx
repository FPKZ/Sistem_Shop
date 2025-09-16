import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Dashbord</h1>
        <div className="fold"></div>
        <div className="fold"></div>
        <div className="fold"></div>
      </div>
      <h1 className="h4 mb-4">Atalhos</h1>
      <div className="row row-cols-*  g-2 g-sm-4">
          <Card icon="plus-square-fill" location={() => navigate(`/cadastro`)}>Cadastro</Card>
          <Card icon="bag-fill" location={() => navigate(`/vendas`)}>Vendas</Card>
          <Card icon="grid-fill" location={() => navigate(`/produtos`)}>Produtos</Card>
          <Card icon="journal-bookmark-fill" location={() => navigate(`/clientes`)}>Clientes</Card>
          <Card icon="upc" location={() => navigate(`/notas`)}>Notas</Card>
      </div>
    </>
  );
}

function Card(props) {
  return (
      <div className="col-auto">
        <div className="card text-center h-100 shadow-sm" onClick={() => props.location()} style={{cursor: 'pointer'}}>
          <div className="card-dimensions card-body px-5 d-flex flex-column justify-content-center align-items-center">
            <i className={`bi bi-${props.icon} mt-0 fs-1`} style={{"color": "rgb(183, 55, 225)"}}></i>
            <p className="card-text mt-2 mb-0 fw-bold" style={{"color": " rgba(147, 51, 179, 1)", "fontWeight": "600"}}>{props.children}</p>
          </div>
        </div>
      </div>
);
}

export default App;

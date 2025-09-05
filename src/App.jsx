//import { useState } from 'react'
import Header from './components/Header'
import Menu from './components/Menu'
import { useNavigate } from 'react-router-dom'

function App() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <Menu />
      <div id="dashbord">
        <h1>Dashbord</h1>
          <div className="fold"></div>
          <div className="fold"></div>
          <div className="fold"></div>
      </div>
      <div id="cards">
          <h1>Atalhos</h1>
          <div className="card btn-cadastro" onClick={() => navigate(`/cadastro`)}><i className="bi bi-plus-square-fill"></i><a>Cadastro</a></div>
          <div className="card" onClick={() => navigate(`/produtos`)}><i className="bi bi-grid-fill"></i><a>Produtos</a></div>
          <div className="card" onClick={() => navigate(`/clientes`)}><i className="bi bi-journal-bookmark-fill"></i><a>Clientes</a></div>
          <div className="card" onClick={() => navigate(`/notas`)}><i className="bi bi-upc"></i><a>Notas</a></div>
          <div className="card"></div>
          <div className="card"></div>
          <div className="card"></div>
          <div className="card"></div>
          <div className="card"></div>
          <div className="card"></div>
          <div className="card"></div>
          <div className="card"></div>
      </div>
    </>
  )
}

export default App

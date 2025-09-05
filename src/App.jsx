//import { useState } from 'react'
import Header from './components/Header'
import Menu from './components/Menu'

function App() {


  return (
    <>
      <Header />
      <Menu />
      <div id="dashbord">
        <h1>Dashbord</h1>
          <div class="fold"></div>
          <div class="fold"></div>
          <div class="fold"></div>
      </div>
      <div id="cards">
          <h1>Atalhos</h1>
      <div class="card btn-cadastro"><i class="fa-solid fa-square-plus"></i><a>Cadastro</a></div>
          <div class="card"><i class="fa-solid fa-shapes"></i><a>Produtos</a></div>
          <div class="card"><i class="fa-solid fa-address-book"></i><a>Clientes</a></div>
          <div class="card"><i class="fa-solid fa-barcode"></i><a>Notas</a></div>
          <div class="card"></div>
          <div class="card"></div>
          <div class="card"></div>
          <div class="card"></div>
          <div class="card"></div>
          <div class="card"></div>
          <div class="card"></div>
          <div class="card"></div>
      </div>
    </>
  )
}

export default App

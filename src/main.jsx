import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import "./imports.jsx"
//import Rotas from "./Router.jsx"
import Cadastro from './pages/cadastro/Cadastro.jsx'
import Clientes from './pages/clientes/Cliente.jsx'
import Produtos from './pages/produtos/Produtos.jsx'
import Notas from './pages/notas/Notas.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/cadastro',
    element: <Cadastro />,
  },
  {
    path: '/clientes',
    element: <Clientes />,
  },
  {
    path: '/produtos',
    element: <Produtos />,
  },
  {
    path: '/notas',
    element: <Notas />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

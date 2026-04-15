import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";



/**
 * ============================================================================
 * LAZY LOADING & CODE SPLITTING (Otimização de Performance)
 * ============================================================================
 * 
 * Em vez de importar todas as páginas da aplicação de uma vez no boot (import normal),
 * utilizamos o `React.lazy`. Isso faz com que o Webpack/Vite divida o código
 * (Code Splitting) em vários arquivos menores chamados de "chunks".
 * 
 * Benefícios:
 * 1. O arquivo principal da aplicação (index.js) fica extremamente pequeno (ex: cai de 1.6MB para 40kB).
 * 2. Quando o usuário entra no sistema, o navegador baixa APENAS o código necessário 
 *    para mostrar a tela inicial.
 * 3. Se um cliente acessa apenas o "/catalogo" no celular, ele jamais fará o download 
 *    do código de tabelas de vendas, geração de PDFs ou gráficos administrativos, 
 *    poupando a internet do usuário e deixando a tela muito mais rápida.
 * 
 * IMPORTANTE: Qualquer página adicionada aqui deve sempre ser envolvida por um 
 * componente <Suspense> na árvore de renderização (veja o src/main.jsx) para exibir 
 * a tela de "Carregando" enquanto o navegador baixa o arquivo da página.
 */
const App                  = lazy(() => import("./App.jsx"));
const Cadastro             = lazy(() => import("./pages/cadastro/Cadastro.jsx"));
const Clientes             = lazy(() => import("./pages/clientes/Cliente.jsx"));
const Produtos             = lazy(() => import("./pages/produtos/Produtos.jsx"));
const InfoProduto          = lazy(() => import("./pages/produtos/include/InfoProduto.jsx"));
const Notas                = lazy(() => import("./pages/notas/Notas.jsx"));
const Vendas               = lazy(() => import("./pages/vendas/Vendas.jsx"));
const NovaVenda            = lazy(() => import("./pages/vendas/subPages/NovaVenda.jsx"));
const TelaVendas           = lazy(() => import("./pages/vendas/subPages/TelaVendas.jsx"));
const Extorno              = lazy(() => import("./pages/vendas/subPages/Extorno.jsx"));
const Devolucao            = lazy(() => import("./pages/vendas/subPages/Devolucao.jsx"));
const CadastroCliente      = lazy(() => import("./pages/cadastro/include/Clientes.jsx"));
const CadastroProduto      = lazy(() => import("./pages/cadastro/include/Produtos.jsx"));
const CadastroNota         = lazy(() => import("./pages/cadastro/include/Notas.jsx"));
const TelaCadastro         = lazy(() => import("./pages/cadastro/include/TelaCadastro.jsx"));
const Login                = lazy(() => import("./auth/page/login/Login.jsx"));
const CadastroUser         = lazy(() => import("./auth/page/cadastro/CadastroUser.jsx"));
const PerfilPage           = lazy(() => import("./pages/perfil/Perfil.jsx"));
const GerenciamentoUsuario = lazy(() => import("./auth/page/ferramentas/GerenciamentoUsuario.jsx"));
const Catalogo             = lazy(() => import("./pages/catalogo/Catalogo.jsx"));

const GlobalError          = lazy(() => import("./pages/erros/GlobalError.jsx"));
const ProtectedRoute       = lazy(() => import("./auth/sistem/ProtectedRoute.jsx"));
const PermissaoRoute       = lazy(() => import("./auth/sistem/PermissaoRoute.jsx"));
const Layout               = lazy(() => import("./components/layout/Layout.jsx"));


const router = createBrowserRouter([
  {
    path: "/",
    element: <Catalogo />,
    errorElement: <GlobalError />
  },
  {
    path: "/painel",
    errorElement: <GlobalError />,
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <App /> },
          {
            path: "cadastro",
            element: <PermissaoRoute permissao="cadastrarProduto" />,
            children: [
              {
                path: "",
                element: <Cadastro />,
                children: [
                  { index: true, element: <TelaCadastro /> },
                  { path: "produto", element: <CadastroProduto /> },
                  { path: "nota", element: <CadastroNota /> },
                  { path: "cliente", element: <CadastroCliente /> },
                ],
              },
            ],
          },
          { path: "clientes", 
            element: <PermissaoRoute permissao="gerenciarClientes" />, 
            children: [
              { index: true, element: <Clientes /> },
            ] 
          },
          { path: "produtos", 
            element: <PermissaoRoute permissao="cadastrarProduto" />, 
            children: [
              { 
                index: true,
                element: <Produtos /> 
              },
              {
                path: "info/:id",
                element: <InfoProduto />
              }
            ] 
          },
          { path: "notas", 
            element: <PermissaoRoute permissao="gerenciarNotas" />, 
            children: [
              { index: true, element: <Notas /> },
            ] 
          },
          {
            path: "vendas",
            element: <Vendas />,
            children: [
              { index: true, element: <TelaVendas /> },
              { path: "Nova-Venda", element: <NovaVenda /> },
              { path: "Extorno", element: <Extorno /> },
              { path: "Devolucao", element: <Devolucao /> },
            ],
          },
          { path: "perfil", element: <PerfilPage /> },
          {
            path: "usuarios",
            element: <PermissaoRoute permissao="gerenciarUsuarios" />,
            children: [
              { index: true, element: <GerenciamentoUsuario /> },
            ],
          },
        ],
      },
    ],
  },
  { path: "login", element: <Login />, errorElement: <GlobalError /> },
  { path: "cadastro-user", element: <CadastroUser />, errorElement: <GlobalError /> },
]);

export default router;
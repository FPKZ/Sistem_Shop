import { lazy } from "react";

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

const Cadastro             = lazy(() => import("./pages/cadastro/Cadastro.jsx"));
const Clientes             = lazy(() => import("./pages/clientes/Cliente.jsx"));
const Produtos             = lazy(() => import("./pages/produtos/Produtos.jsx"));
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
const PerfilPage           = lazy(() => import("./auth/page/perfil/Perfil.jsx"));
const GerenciamentoUsuario = lazy(() => import("./auth/page/ferramentas/GerenciamentoUsuario.jsx"));
const Catalogo             = lazy(() => import("./pages/catalogo/Catalogo.jsx"));

export {
  Cadastro,
  Clientes,
  Produtos,
  Notas,
  Vendas,
  NovaVenda,
  TelaVendas,
  Extorno,
  Devolucao,
  CadastroCliente,
  CadastroNota,
  CadastroProduto,
  TelaCadastro,
  Login,
  CadastroUser,
  PerfilPage,
  GerenciamentoUsuario,
  Catalogo,
};

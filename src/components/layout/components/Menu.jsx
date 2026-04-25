import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePermissoes } from "@hooks/auth/usePermissoes";

const Menu = React.memo(({menuExpand, setMenuExpand , mobile}) => {
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const { pode } = usePermissoes();
  
  const handleMouseEnter = () => {
    if (!mobile) setMenuExpand(true);
  };

  const handleMouseLeave = () => {
    if (!mobile) setMenuExpand(false);
  };

  function handleNavigate(path){
    navigate(path)
    setMenuExpand(false)
  }

  return (
    <nav 
      id="menu" 
      ref={menuRef} 
      className="d-flex flex-column text-white p-0 z-1003" 
      style={{height: "100dvh"}}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ul className="nav nav-pills flex-column mb-auto">
        {mobile && (
          <ItenMenu icon="list" onClick={() => menuExpand ? setMenuExpand(false) : setMenuExpand(true)}>Menu</ItenMenu>
        )}
        {pode("verDashboard") && (
          <ItenMenu mobile={mobile} icon="house-fill" onClick={() => handleNavigate(`/painel`)}>Inicio</ItenMenu>
        )}
        {pode("verVendas") && (
          <ItenMenu mobile={mobile} icon="bag-fill" onClick={() => handleNavigate(`/painel/vendas`)}>Vendas</ItenMenu>
        )}
        {pode("verCadastros") && (
          <ItenMenu mobile={mobile} icon="plus-square-fill" onClick={() => handleNavigate(`/painel/cadastro`)}>Cadastro</ItenMenu>
        )}
        {pode("verProdutos") && (
          <ItenMenu mobile={mobile} icon="grid-fill" onClick={() => handleNavigate(`/painel/produtos`)}>Produtos</ItenMenu>
        )}
        {pode("verClientes") && (
          <ItenMenu mobile={mobile} icon="journal-bookmark-fill" onClick={() => handleNavigate(`/painel/clientes`)}>Clientes</ItenMenu>
        )}
        {pode("verNotas") && (
          <ItenMenu mobile={mobile} icon="upc" onClick={() => handleNavigate(`/painel/notas`)}>Notas</ItenMenu>
        )}
        {pode("verUsuarios") && (
          <ItenMenu mobile={mobile} icon="people-fill" onClick={() => handleNavigate(`/painel/usuarios`)}>Usuários</ItenMenu>
        )}
      </ul>
    </nav>
  )
});

function ItenMenu({mobile, icon, children, classCuston, ...rest}){
  const style = {
    cursor: "pointer",
    ...rest.style
  }

  return (
    <li className={`nav-item ${classCuston}`} {...rest} style={style}>
      <a className="nav-link text-white d-flex align-items-center p-md-3 p-2 rounded-0">
        <i className={`bi bi-${icon} ${mobile ? "fs-5" : "fs-4"}`}></i>
        <span className="ms-3">{children}</span>
      </a>
    </li>
  )
}

export default Menu;

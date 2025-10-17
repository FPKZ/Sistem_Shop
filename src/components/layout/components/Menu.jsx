import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Menu({menuExpand, setMenuExpand , mobile}) {
  //const [menuExpand, setMenuExpand] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  
  useEffect(() => {
    const menuElement = menuRef.current
    if (!menuElement) return

    const handleMouseEnter = () => setMenuExpand(true)
    const handleMouseLeave = () => setMenuExpand(false)
    if(!mobile){
      menuElement.addEventListener("mouseenter", handleMouseEnter)
      menuElement.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      menuElement.removeEventListener("mouseenter", handleMouseEnter)
      menuElement.removeEventListener("mouseleave", handleMouseLeave)
    }

  }, [setMenuExpand, mobile])

  function handleNavigate(path){
    navigate(path)
    setMenuExpand(false)
  }

  return (
    <nav id="menu" ref={menuRef} className="d-flex flex-column text-white p-0 z-3" style={{height: "100dvh"}}>
      <ul className="nav nav-pills flex-column mb-auto">
        {mobile && (
          <ItenMenu icon="list" onClick={() => menuExpand ? setMenuExpand(false) : setMenuExpand(true)}>Menu</ItenMenu>
        )}
        <ItenMenu mobile={mobile} icon="house-fill" onClick={() => handleNavigate(`/`)}>Inicio</ItenMenu>
        <ItenMenu mobile={mobile} icon="bag-fill" onClick={() => handleNavigate(`/vendas`)}>Vendas</ItenMenu>
        <ItenMenu mobile={mobile} icon="plus-square-fill" onClick={() => handleNavigate(`/cadastro`)}>Cadastro</ItenMenu>
        <ItenMenu mobile={mobile} icon="grid-fill" onClick={() => handleNavigate(`/produtos`)}>Produtos</ItenMenu>
        <ItenMenu mobile={mobile} icon="journal-bookmark-fill" onClick={() => handleNavigate(`/clientes`)}>Clientes</ItenMenu>
        <ItenMenu mobile={mobile} icon="upc" onClick={() => handleNavigate(`/notas`)}>Notas</ItenMenu>
      </ul>
    </nav>
  )
}

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

    // <div id="btn"><i className="fa-solid fa-house-chimney"></i><a>Inicio</a></div>
    // <div id="btn"><i className="fa-solid fa-shapes"></i><a>Produtos</a></div>
    // <div id="btn" className="btn-cadastro"><i className="fa-solid fa-square-plus"></i><a>Cadastro</a></div>
    // <div id="btn"><i className="fa-solid fa-address-book"></i><a>Clientes</a></div>
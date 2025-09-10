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
    if(mobile) setMenuExpand(false)
  }

  return (
    <nav id="menu" ref={menuRef} className="d-flex flex-column vh-100 text-white p-0 z-3">
      <ul className="nav nav-pills flex-column mb-auto">
        {mobile && (
          <ItenMenu icon="list" onClick={() => menuExpand ? setMenuExpand(false) : setMenuExpand(true)}>Menu</ItenMenu>
        )}
        <ItenMenu icon="house-fill" onClick={() => handleNavigate(`/`)}>Inicio</ItenMenu>
        <ItenMenu icon="grid-fill" onClick={() => handleNavigate(`/produtos`)}>Produtos</ItenMenu>
        <ItenMenu icon="journal-bookmark-fill" onClick={() => handleNavigate(`/clientes`)}>Clientes</ItenMenu>
        <ItenMenu icon="plus-square-fill" onClick={() => handleNavigate(`/cadastro`)}>Cadastro</ItenMenu>
        <ItenMenu icon="upc" onClick={() => handleNavigate(`/notas`)}>Notas</ItenMenu>
      </ul>
    </nav>
  )
}

function ItenMenu(props){
  return (
    <li className="nav-item" {...props}>
      <a href="#" className="nav-link text-white d-flex align-items-center p-4 rounded-0">
        <i className={`bi bi-${props.icon} fs-4`}></i>
        <span className="ms-3">{props.children}</span>
      </a>
    </li>
  )
}

    // <div id="btn"><i className="fa-solid fa-house-chimney"></i><a>Inicio</a></div>
    // <div id="btn"><i className="fa-solid fa-shapes"></i><a>Produtos</a></div>
    // <div id="btn" className="btn-cadastro"><i className="fa-solid fa-square-plus"></i><a>Cadastro</a></div>
    // <div id="btn"><i className="fa-solid fa-address-book"></i><a>Clientes</a></div>
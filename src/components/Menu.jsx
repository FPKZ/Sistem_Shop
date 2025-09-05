import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Menu() {
  const [menuExpand, setMenuExpand] = useState(false)
  const [menuButton, setMenuButton] = useState(window.innerWidth < 900)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => {
      setMenuButton(window.innerWidth < 900)
    }

    const menuElement = menuRef.current
    if (menuElement) {
      if (window.innerWidth >= 900){
        const handleMouseEnter = () => setMenuExpand(true)
        const handleMouseLeave = () => setMenuExpand(false)
  
        menuElement.addEventListener("mouseenter", handleMouseEnter)
        menuElement.addEventListener("mouseleave", handleMouseLeave)
  
        return () => {
          menuElement.removeEventListener("mouseenter", handleMouseEnter)
          menuElement.removeEventListener("mouseleave", handleMouseLeave)
        }
      } else {
        menuElement.removeEventListener("mouseenter", () => {})
        menuElement.removeEventListener("mouseleave", () => {})

      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }

  }, [])

  useEffect(() => {
    if(menuExpand){
       document.body.classList.add("menu-expand")
    } else {
      document.body.classList.remove("menu-expand")  
    }
  }, [menuExpand])

  // const menu = document.getElementById("menu");
  // const body = document.body;
  // console.log(menu)

  // if (menu) {
  //     console.log(menu)
  //     if (body.offsetWidth < 900) {
  //         const btn = document.createElement("div");
  //         btn.id = "btn";
  //         btn.classList = "btn-menu";
  //         btn.innerHTML = `<i class="fa-solid fa-bars"></i><a>Menu</a>`;
  //         menu.prepend(btn);
  //     } else {
  //         menu.addEventListener("mouseenter", () => {
  //         body.classList.add("menu-expand");
  //         });
  //         menu.addEventListener("mouseleave", () => {
  //         body.classList.remove("menu-expand");
  //         });
  //     }
  // }

  // const btn_cadastrar = document.querySelectorAll(".btn-cadastro")

  // console.log(btn_cadastrar)

  // btn_cadastrar.forEach(e => {
  //     e.addEventListener("click", () => {
  //         window.location.assign("pages/cadastro/cadastro.html")
  //     })
  // })

  return (
    <nav id="menu" ref={menuRef} className="">
      <ul className="nav">
        {menuButton && (
          <li className="nav-item" onClick={() => menuExpand ? setMenuExpand(false) : setMenuExpand(true)}>
            <i className="bi bi-list"></i>
            <a>
              Menu
            </a>
          </li>
        )}
        <li className="nav-item" onClick={() => navigate(`/`)}>
          <i className="bi bi-house-fill"></i><a>Inicio</a>
        </li>
        <li className="nav-item" onClick={() => navigate(`/produtos`)}>
          <i className="bi bi-grid-fill"></i>
          <a>
            Produtos
          </a>
        </li>
        <li className="nav-item" onClick={() => navigate(`/clientes`)}>
          <i className="bi bi-journal-bookmark-fill"></i>
          <a>
            Clientes
          </a>
        </li>
        <li className="nav-item" onClick={() => navigate(`/cadastro`)}>
          <i className="bi bi-plus-square-fill"></i>
          <a>
            Cadastro
          </a>
        </li>
        <li className="nav-item" onClick={() => navigate(`/notas`)}>
          <i className="bi bi-upc"></i>
          <a>
            Notas
          </a>
        </li>
      </ul>
    </nav>
  )
}

    // <div id="btn"><i className="fa-solid fa-house-chimney"></i><a>Inicio</a></div>
    // <div id="btn"><i className="fa-solid fa-shapes"></i><a>Produtos</a></div>
    // <div id="btn" className="btn-cadastro"><i className="fa-solid fa-square-plus"></i><a>Cadastro</a></div>
    // <div id="btn"><i className="fa-solid fa-address-book"></i><a>Clientes</a></div>

import { Button, Figure, Dropdown } from "react-bootstrap";
import { useAuth } from "@autentic-sistem/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {


  const { logout, user } = useAuth()
  
  let imgSize 
  
  

  return (
    <header id="header" className="p-0 px-3 text-white d-flex align-items-center justify-content-between">
      <h1>Sistem Shop</h1>

      <div id="user-menu" className="d-flex align-items-center h-100">
        <ProfileMenu user={user} imgSize={imgSize} logout={logout} />
        
        {/* <Dropdown align="end" show={show} onMouseEnter={() => swtShow(true)} onMouseLeave={() => swtShow(false)}>
          <Dropdown.Toggle as="div" id="dropdown-custom-components" className="d-inline dropdown-toggle-no-caret">
            <Figure className="d-flex m-0 p-0 align-items-center" style={{cursor: "pointer"}}>
              <Figure.Image
                className="m-0"
                alt="Usuário"
                src={user.img || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                roundedCircle
                style={{ width: imgSize, height: imgSize, objectFit: 'cover', objectPosition: 'center', border: '2px solid #eaeaeaa1' }}
              />
            </Figure>
          </Dropdown.Toggle>
          <Dropdown.Menu align="end">
            <Dropdown.ItemText className="text-center">{user.nome}</Dropdown.ItemText>
            <Dropdown.Divider />
            <Dropdown.Item className="text-start">Perfil</Dropdown.Item>
            <Dropdown.Item className="text-start">Configuração</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => logout()}><i className="bi bi-power me-2"></i>Sair</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown> */}
        {/* <Figure className="d-flex m-0 p-0 align-items-center" style={{cursor: "pointer"}}>
          <Figure.Image
            className="m-0"
            width={imgSize}
            height={imgSize}
            alt="Usuário"
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            roundedCircle
          />
        </Figure> */}
        {/* <span className="me-3">Usuário</span>
        <Button variant="outline-light" onClick={() => logout()}>Sair</Button> */}
      </div>
    </header>
  )
}


function ProfileMenu({ user, logout }) {

  const [show, setShow] = useState(false);
  const [imgSizeState, setImgSizeState] = useState(35)

  const navigate = useNavigate()

  useEffect(() => {
    const calcSize = () => {
      const userMenu = document.getElementById("user-menu");
      if (userMenu) {
        setImgSizeState(userMenu.clientHeight - 7)
      }
    };

    calcSize();
    // console.log(imgSizeState)

    window.addEventListener('resize', () => calcSize());
    
    return () => {
      window.removeEventListener('resize', () => calcSize());
    };

  },[])

  return (
    <Dropdown align="end" show={show} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <Dropdown.Toggle as="div" id="dropdown-custom-components" className="d-flex dropdown-toggle-no-caret" onClick={() => setShow(!show)} >
        <Figure className="d-flex m-0 p-0 align-items-center" style={{cursor: "pointer"}}>
          <Figure.Image
            className="m-0"
            alt="Usuário"
            src={user.img || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            roundedCircle
            style={{ width: imgSizeState, height: imgSizeState, objectFit: 'cover', objectPosition: 'center', border: '2px solid #eaeaeaa1' }}
          />
        </Figure>
      </Dropdown.Toggle>
      <Dropdown.Menu align="end" style={{marginTop: "-2px"}}>
        <Dropdown.ItemText className="text-center">{user.nome}</Dropdown.ItemText>
        <Dropdown.Divider />
        <Dropdown.Item className="text-start" onClick={() => navigate("perfil")}>Perfil</Dropdown.Item>
        <Dropdown.Item className="text-start"onClick={() => navigate("ferramentas")}>Ferramentas</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={() => logout()}><i className="bi bi-power me-2"></i>Sair</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}
import { Button, Figure, Dropdown } from "react-bootstrap";
import { useAuth } from "@auth-sistem/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import utils from "@app/utils";

export default function Header({ mobile }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  let imgSize;

  const location = useLocation();
  const pathParts = location.pathname.split("/").filter((part) => part);

  const breadcrumbTitles = {
    usuarios: "Usuários",
    Extorno: "Estorno",
    Devolucao: "Devolução",
    // Adicione outras traduções conforme necessário
  };

  return (
    <>
      <header
        id="header"
        className="p-0 px-3 d-flex align-items-center justify-content-between"
      >
        <div className="d-flex justify-content-center flex-wrap flex-md-nowarp align-items-center gap-4 position-relative">
          {pathParts.length > 0 ? (
            <>
              <Button
                className="btn btn-roxo "
                size={mobile && "sm"}
                onClick={() => {
                  pathParts.length > 1 ? navigate(-1) : navigate("/");
                }}
              >
                <i className="bi bi-chevron-left"></i>
              </Button>
              {/* <nav
              className="d-flex justify-content-center align-items-center"
              aria-label="breadcrumb"
          >
              <ol className="breadcrumb breadcrumb-sm-chevron d-flex align-content-center m-0">
                {mobile ? 
                  <h1 className="h3 breadcrumb-item m-0 d-flex align-items-center fs-3">{breadcrumbTitles[0] || utils.capitalize(pathParts[0])}</h1>
                  :
                  pathParts.length &&
                    pathParts.map(tela => (
                    <h1 key={tela} className="h3 breadcrumb-item m-0 d-flex align-items-center fs-3">{breadcrumbTitles[tela] || utils.capitalize(tela)}</h1>
                  ))
                }
              </ol>
          </nav> */}
            </>
          ) : (
            ""
          )}
        </div>
        <div id="user-menu" className="d-flex align-items-center h-100">
          <h1 className="me-3 m-0 fs-5">Sistem Shop</h1>
          <ProfileMenu user={user} imgSize={imgSize} logout={logout} />
        </div>
      </header>
      {/* {mobile && 
      pathParts.length > 1 ? (
      <div className="mt-2">
        <nav
            className="d-flex justify-content-center align-items-center"
            aria-label="breadcrumb"
        >
          <ol className="breadcrumb breadcrumb-sm-chevron d-flex align-content-center  m-0">
            {pathParts.map(tela => {
              if(tela !== pathParts[0]){
                return (
                  <h1 key={tela} className="h3 breadcrumb-item m-0 d-flex align-items-center fs-6">{breadcrumbTitles[tela] || utils.capitalize(tela)}</h1>
                )
              }
            })}
          </ol>
        </nav>
      </div>
      ) : ""
    } */}
    </>
  );
}

function ProfileMenu({ user, logout }) {
  const [show, setShow] = useState(false);
  const [imgSizeState, setImgSizeState] = useState(35);

  const navigate = useNavigate();

  // 1. Detecta se o dispositivo suporta toque (mobile) ou não (desktop)
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  useEffect(() => {
    const calcSize = () => {
      const userMenu = document.getElementById("user-menu");
      if (userMenu) {
        setImgSizeState(userMenu.clientHeight - 7);
      }
    };

    calcSize();
    // console.log(imgSizeState)

    window.addEventListener("resize", () => calcSize());

    return () => {
      window.removeEventListener("resize", () => calcSize());
    };
  }, []);

  const handleShowMenu = async () => {
    if (isTouchDevice) setShow(!show);
  };

  return (
    <Dropdown
      align="end"
      show={show}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <Dropdown.Toggle
        as="div"
        id="dropdown-custom-components"
        className="d-flex dropdown-toggle-no-caret"
        onClick={() => handleShowMenu()}
      >
        <Figure
          className="d-flex m-0 p-0 align-items-center"
          style={{ cursor: "pointer" }}
        >
          <Figure.Image
            className="m-0"
            alt="Usuário"
            src={
              user.img ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            roundedCircle
            style={{
              width: imgSizeState,
              height: imgSizeState,
              objectFit: "cover",
              objectPosition: "center",
              border: "2px solid #eaeaeaa1",
            }}
          />
        </Figure>
      </Dropdown.Toggle>
      <Dropdown.Menu align="end" style={{ marginTop: "-2px" }}>
        <Dropdown.ItemText className="text-center">
          {user.nome}
        </Dropdown.ItemText>
        <Dropdown.Divider />
        <Dropdown.Item
          className="text-start"
          onClick={() => navigate("perfil")}
        >
          Perfil
        </Dropdown.Item>
        <Dropdown.Item
          className="text-start"
          onClick={() => navigate("usuarios")}
        >
          Ferramentas
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={() => logout()}>
          <i className="bi bi-power me-2"></i>Sair
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

import React, { useState } from "react";
import { Button, Figure, Dropdown } from "react-bootstrap";
import { useAuth } from "@auth-sistem/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import utils from "@services/utils";

const Header = React.memo(({ mobile }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const location = useLocation();
  const pathParts = location.pathname.split("/").filter((part) => part);

  // eslint-disable-next-line no-unused-vars
  const breadcrumbTitles = {
    usuarios: "Usuários",
    Extorno: "Estorno",
    Devolucao: "Devolução",
  };

  return (
    <>
      <header
        id="header"
        className="p-0 px-2 px-md-3 d-flex align-items-center justify-content-between"
      >
        <div className="d-flex justify-content-center flex-wrap flex-md-nowarp align-items-center gap-4 position-relative">
          {pathParts.length > 1 ? (
            <>
              <Button
                className="btn btn-roxo "
                size={mobile && "sm"}
                onClick={() => {
                  pathParts.length > 2 ? navigate(-1) : navigate("/painel");
                }}
              >
                <i className="bi bi-chevron-left"></i>
              </Button>
            </>
          ) : (
            ""
          )}
        </div>
        <div id="user-menu" className="d-flex align-items-center h-100">
          <h1 className="me-2 m-0 text-[1rem]!">Sistem Shop</h1>
          <ProfileMenu user={user} logout={logout} />
        </div>
      </header>
    </>
  );
});

const ProfileMenu = React.memo(({ user, logout }) => {
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  // 1. Detecta se o dispositivo suporta toque (mobile) ou não (desktop)
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

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
        <Figure className="d-flex m-0 p-0 align-items-center profile-trigger">
          <Figure.Image
            className="m-0 profile-avatar w-11 xl:w-13!"
            alt="Usuário"
            src={
              user.img ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            roundedCircle
          />
        </Figure>
      </Dropdown.Toggle>
      <Dropdown.Menu align="end" className="profile-menu">
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
});

export default Header;

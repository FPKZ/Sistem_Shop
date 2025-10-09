import Header from "./components/Header";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import utils from "@app/utils";

export default function Layout() {
  const [menuExpand, setMenuExpand] = useState(false);
  const [mobile, setMobile] = useState(window.innerWidth < 766);

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 766);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (menuExpand) {
      document.body.classList.add("menu-expand");
    } else {
      document.body.classList.remove("menu-expand");
    }
  }, [menuExpand]);


  const location = useLocation()
  const pathParts = location.pathname.split('/').filter(part => part)

  return (
    <>
      <Header
        menuExpand={menuExpand}
        setMenuExpand={setMenuExpand}
        mobile={mobile}
      />
      <Menu
        menuExpand={menuExpand}
        setMenuExpand={setMenuExpand}
        mobile={mobile}
      />
      <div id="root-content">
        <main className="main pt-2 pt-md-0 ">
          <Outlet context={{ mobile, setMobile }} />
        </main>
      </div>
      <Footer />
    </>
  );
}

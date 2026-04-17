import Header from "./components/Header";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";


export default function Layout() {
  const [menuExpand, setMenuExpand] = useState(false);
  const [mobile, setMobile] = useState(window.innerWidth < 766);

  const { pathname } = useLocation();

  useEffect(() => {
    // BUG FIX: O scroll da área administrativa ocorre dentro da div #root,
    // não na janela inteira. Ao trocar de rota, resetamos o scroll para o topo.
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);

  useEffect(() => {
    
    document.body.classList.add("layout-ativo");

    const handleResize = () => {
      setMobile(window.innerWidth < 766);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.classList.remove("layout-ativo")
    };
  }, []);

  useEffect(() => {
    if (menuExpand) {
      document.body.classList.add("menu-expand");
    } else {
      document.body.classList.remove("menu-expand");
    }
  }, [menuExpand]);

  const contextValue = useMemo(() => ({
    mobile,
    setMobile
  }), [mobile]);

  


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
        <main className="main p-0 pt-md-0 " >
          <Outlet context={ contextValue } />
        </main>
      </div>
      <Footer />
    </>
  );
}

import Header from "./components/Header";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";


export default function Layout() {
  const [menuExpand, setMenuExpand] = useState(false);
  const [mobile, setMobile] = useState(window.innerWidth < 766);

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
        <main className="main p-3 pt-md-0 " >
          <Outlet context={ contextValue } />
        </main>
      </div>
      <Footer />
    </>
  );
}

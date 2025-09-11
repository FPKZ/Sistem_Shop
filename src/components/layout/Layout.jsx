import Header from "./components/Header";
import Menu from "./components/Menu";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Layout() {
  const [menuExpand, setMenuExpand] = useState(false);
  const [mobile, setMobile] = useState(window.innerWidth < 900)
  
  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 900)
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
  
  return (
    <>
      <Header menuExpand={menuExpand} setMenuExpand={setMenuExpand} mobile={mobile} />
      <Menu menuExpand={menuExpand} setMenuExpand={setMenuExpand} mobile={mobile} />
      <div id="root-content">
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </>
  );
}

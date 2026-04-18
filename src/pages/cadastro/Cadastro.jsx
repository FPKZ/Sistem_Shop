import { Outlet, useOutletContext } from "react-router-dom";

function Cadastro() {

  // console.log(pathParts);
  const { mobile } = useOutletContext();
  
  return (
    <div className="p-2 pt-3 p-md-4">
      <div className="row row-cols-* g-2 g-md-4">
        <Outlet context={{ mobile }}  />
      </div>
    </div>
  );
}
export default Cadastro;

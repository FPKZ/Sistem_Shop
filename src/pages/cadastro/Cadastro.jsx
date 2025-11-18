import { Outlet } from "react-router-dom";

function Cadastro() {

  // console.log(pathParts);

  return (
    <div className="p- p-md-4">
      <div className="row row-cols-* g-2 g-md-4">
        <Outlet context={{ }}  />
      </div>
    </div>
  );
}
export default Cadastro;

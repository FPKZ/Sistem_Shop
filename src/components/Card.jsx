export function Card(props) {
    return (
        <div className="col col-md-2 col-lg-auto">
          <div className={`card ${props.disabled ? "opacity-50!" : "cursor-pointer hover:shadow-md hover:scale-105 "} text-center h-100 shadow-sm transition`} onClick={() => {if(props.disabled) return; props.location?.(); props.setTela?.()}}>
            <div className=" card-body px-5 d-flex flex-column justify-content-center align-items-center">
              <i className={`bi bi-${props.icon} mt-0 fs-1`} style={{"color": "rgb(183, 55, 225)"}}></i>
              <p className="card-text mt-2 mb-0 fw-bold" style={{"color": " rgba(147, 51, 179, 1)", "fontWeight": "600"}}>{props.children}</p>
            </div>
          </div>
        </div>
  );
}

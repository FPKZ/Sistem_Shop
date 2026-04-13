export function Card(props) {
    return (
        <div className="col col-md-2 col-lg-auto">
          <div className="card text-center h-100 shadow-sm hover:scale-105 hover:shadow-md transition cursor-pointer" onClick={() => {props.location?.(); props.setTela?.()}} style={{cursor: 'pointer'}}>
            <div className=" card-body px-5 d-flex flex-column justify-content-center align-items-center">
              <i className={`bi bi-${props.icon} mt-0 fs-1`} style={{"color": "rgb(183, 55, 225)"}}></i>
              <p className="card-text mt-2 mb-0 fw-bold" style={{"color": " rgba(147, 51, 179, 1)", "fontWeight": "600"}}>{props.children}</p>
            </div>
          </div>
        </div>
  );
}

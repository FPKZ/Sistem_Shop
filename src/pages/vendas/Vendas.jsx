import { Container } from "react-bootstrap";
import { Outlet, useOutletContext } from "react-router-dom";



export default function Vendas(){
    const { mobile } = useOutletContext()

    
    return(
        <Container fluid className="p-md-0 p-0 m-0">
            <Outlet context={{ mobile }}/>
        </Container>
    )
}
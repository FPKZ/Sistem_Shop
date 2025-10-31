import { Container } from "react-bootstrap";
import { Outlet, useOutletContext } from "react-router-dom";



export default function Vendas(){
    const { mobile } = useOutletContext()

    
    return(
        <Container fluid className="p-2 p-md-4">
            <Outlet context={{ mobile }}/>
        </Container>
    )
}
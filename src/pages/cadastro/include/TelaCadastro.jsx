import { Card } from "@components/Card";
import { useNavigate } from "react-router-dom";

export default function TelaCadastro() {
    const navigate = useNavigate();

    return(
        <>
            <Card
                icon="grid-fill"
                location={() => navigate("produto")}
            >
                Produtos
            </Card>
            <Card
                icon="upc"
                location={() => navigate("nota")}
            >
                Notas
            </Card>
            <Card
                icon="bi bi-person-fill-add"
                location={() => navigate("cliente")}
            >
                Clientes
            </Card>
        </>
    )
}

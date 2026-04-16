import { Card } from "@components/Card";
import { useNavigate } from "react-router-dom";
import { usePermissoes } from "@hooks/auth/usePermissoes";

export default function TelaCadastro() {
    const navigate = useNavigate();
    const { pode } = usePermissoes();

    return(
        <>
            <Card
                icon="grid-fill"
                location={() => navigate("produto")}
                disabled={!pode("cadastrarProduto")}
            >
                Produtos
            </Card>
            <Card
                icon="upc"
                location={() => navigate("nota")}
                disabled={!pode("cadastrarNotas")}
            >
                Notas
            </Card>
            <Card
                icon="bi bi-person-fill-add"
                location={() => navigate("cliente")}
                disabled={!pode("cadastrarCliente")}
            >
                Clientes
            </Card>
        </>
    )
}

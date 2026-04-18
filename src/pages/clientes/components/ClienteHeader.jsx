import { Button } from "react-bootstrap";
import { Plus } from "lucide-react";
import HoverBtn from "@components/HoverBtn";
import { usePermissoes } from "@hooks/auth/usePermissoes";

export function ClienteHeader({ mobile, onOpenCadastro }) {
  const { pode } = usePermissoes();
  return (
    <div className="d-flex flex-row position-relative justify-content-between align-items-start gap-4 mb-4">
      <div>
        <h2 className="h4 fw-semibold">Clientes Cadastrados</h2>
        <p className="text-muted small">Gerencie e acompanhe seus clientes.</p>
      </div>
      {pode("cadastrarCliente") && 
        mobile ? (
          <HoverBtn
            upClass={"position-absolute end-0"}
            func={onOpenCadastro}
            mobile={mobile}
          >
            Adicionar Cliente
          </HoverBtn>
        ) : (
          <Button
            onClick={onOpenCadastro}
            className="btn-roxo d-flex align-items-center gap-2"
          >
            <Plus size={16} />
            Cadastrar Cliente
          </Button>
        )
      }
    </div>
  );
}

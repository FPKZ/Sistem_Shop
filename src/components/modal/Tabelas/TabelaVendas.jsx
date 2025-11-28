import { ButtonGroup, Table, Button, Badge } from "react-bootstrap";
import utils from "@app/utils";

export default function TabelaClientes({ vendas, onView }) {
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "concluida":
        return "success";
      case "pendente":
        return "warning";
      case "cancelada":
        return "danger";
      case "devolvida":
        return "info";
      default:
        return "secondary";
    }
  };

  return (
    <div className="table-responsive">
      <Table hover className="align-middle mb-0">
        <thead className="bg-light">
          <tr>
            <th className="border-0 text-secondary small text-uppercase">ID</th>
            <th className="border-0 text-secondary small text-uppercase">
              Cliente
            </th>
            <th className="border-0 text-secondary small text-uppercase">
              Data
            </th>
            <th className="border-0 text-secondary small text-uppercase">
              Valor
            </th>
            <th className="border-0 text-secondary small text-uppercase">
              Status
            </th>
            <th className="border-0 text-secondary small text-uppercase text-end">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {vendas && vendas.length > 0 ? (
            vendas.map((venda) => (
              <tr key={venda.id}>
                <td className="fw-bold">#{venda.id}</td>
                <td>{venda.cliente?.nome || "Cliente N/A"}</td>
                <td>{utils.formatDate(venda.data_venda)}</td>
                <td className="fw-bold text-dark">
                  {utils.formatMoney(venda.valor_total)}
                </td>
                <td>
                  <Badge
                    bg={getStatusBadge(venda.status)}
                    className="fw-normal"
                  >
                    {utils.capitalize(venda.status)}
                  </Badge>
                </td>
                <td className="text-end">
                  <Button
                    variant="light"
                    size="sm"
                    className="text-primary btn-icon"
                    onClick={() => onView(venda)}
                    title="Visualizar Detalhes"
                  >
                    <i className="bi bi-eye"></i>
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4 text-muted">
                Nenhuma venda encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

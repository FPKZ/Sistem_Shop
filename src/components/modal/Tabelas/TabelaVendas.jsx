import { ButtonGroup, Card, Table, Button } from "react-bootstrap";
import utils from "@app/utils"


export default function TabelaClientes({vendas}){

    return (
        <Card className="p-0 m-0">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <Card.Title>
                    Vendas totais ({vendas ? vendas.length : 0})
                </Card.Title>
            </Card.Header>
            <Card.Body className="p-0">
                <Table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>cliente</th>
                            <th>Data</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            vendas.map(venda => (
                                <tr key={venda.id}>
                                    <td>
                                        <div>
                                            <strong>{venda.id}</strong>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <span>{venda.cliente.nome}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <span>{utils.formatDate(venda.data_venda)}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <span>{utils.capitalize(venda.status)}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <ButtonGroup size="sm">
                                                <Button 
                                                    variant="outline-secondary" 
                                                    onClick={() => handleViewProfile(nota)}
                                                    title="View Venda"
                                                >
                                                    <i className="bi bi-eye"></i>
                                                </Button>
                                                <Button
                                                    variant="outline-success"
                                                >
                                                    <i className="bi bi-basket2"></i>
                                                </Button>
                                            </ButtonGroup>
                                        </div>
                                    </td>
                                </tr>

                            ))
                        }
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    )
}
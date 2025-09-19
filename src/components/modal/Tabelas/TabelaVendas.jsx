import { ButtonGroup, Card, Table, Button } from "react-bootstrap";


export default function TabelaClientes({vendas}){

    return (
        <Card>
            <Card.Header>
                <Card.Title>
                    Vendas totais ({vendas ? vendas.length : 0})
                </Card.Title>
            </Card.Header>
            <Card.Body>
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
                        <tr>
                            <td>
                                <div>
                                    <strong>1</strong>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <span>Rosangela de Souza</span>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <span>12/07/2025</span>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <span>Finalizada</span>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <ButtonGroup>
                                        <Button/>
                                        <Button/>
                                    </ButtonGroup>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    )
}
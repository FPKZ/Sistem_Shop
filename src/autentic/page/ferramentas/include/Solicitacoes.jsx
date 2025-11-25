import { useEffect } from "react"
import { Table, Card, Button, Image } from "react-bootstrap"
import utils from "@app/utils"
import { CheckCircle, XCircle } from "lucide-react"
//paginação
import { usePagination } from "@hooks/usePagination"
import PaginationButtons from "@components/Pagination/PaginationButtons"

export default function Solicitacoes({solicitacoes, aproveSolicitacao, deleteSolicitacao}){
    console.log(solicitacoes)
    const {
        currentItems,
        currentPage,
        totalPages,
        // itemsPerPage,
        handlePageChange,
        // handleItemsPerPageChange,
        // indexOfFirstItem,
        // indexOfLastItem,
        // totalItems,
        setCurrentPage
      } = usePagination(solicitacoes, 10);

    // Resetar para a página 1 quando o filtro mudar
    useEffect(() => {
      setCurrentPage(1);
    }, [solicitacoes, setCurrentPage]);
    
    return(
        
            <Card className="shadow-sm">
                <Card.Body>
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>Usuário</th>
                                <th>Data da Solicitação</th>
                                <th className="text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(solicit => (
                                <tr key={solicit.id}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <Image src="https://cdn-icons-png.flaticon.com/512/149/149071.png" roundedCircle width="40" height="40" className="me-3" />
                                            <div>
                                                <div className="fw-bold">{solicit.nome}</div>
                                                <div className="text-muted small">{solicit.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{utils.formatDateTime(solicit.createdAt)}</td>
                                    <td className="text-center">
                                        <Button variant="success" size="sm" className="me-2 d-inline-flex align-items-center" onClick={() => aproveSolicitacao(solicit)}>
                                            <CheckCircle size={16} className="me-1" /> Aprovar
                                        </Button>
                                        <Button variant="danger" size="sm" className="d-inline-flex align-items-center" onClick={() => deleteSolicitacao(solicit)}>
                                            <XCircle size={16} className="me-1" /> Rejeitar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <PaginationButtons
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </Card.Body>
            </Card>
    )
}
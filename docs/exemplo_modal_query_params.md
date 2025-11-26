# Exemplo: Modal via Query Params (URL)

Este método permite abrir o modal usando a URL (ex: `.../clientes?detalhes=1`) sem precisar alterar suas rotas no `main.jsx`.

## Alterações no `src/pages/clientes/Cliente.jsx`

Você precisará substituir o controle de estado manual (`useState`) pelo controle via URL (`useSearchParams`).

```javascript
import { useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom"; // 1. Importe useSearchParams
// ... outros imports

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [modalCadastroCliente, setModalCadastroCliente] = useState(false);

  // 2. REMOVA estes estados antigos:
  // const [showDetailsModal, setShowDetailsModal] = useState(false);
  // const [selectedClient, setSelectedClient] = useState(null);

  // 3. ADICIONE a lógica de Query Params:
  const [searchParams, setSearchParams] = useSearchParams();

  // Pega o ID da URL (ex: ?detalhes=15)
  const detalhesId = searchParams.get("detalhes");

  // Encontra o cliente correspondente na lista
  const selectedClient = clientes.find((c) => String(c.id) === detalhesId);

  // O modal deve abrir se tivermos um cliente válido selecionado
  const showDetailsModal = !!selectedClient;

  // ... (código de filtros e paginação continua igual) ...

  // 4. ATUALIZE a função que abre o modal
  const handleShowDetails = (cliente) => {
    // Atualiza a URL mantendo outros filtros se existirem
    setSearchParams((prev) => {
      prev.set("detalhes", cliente.id);
      return prev;
    });
  };

  // 5. CRIE a função para fechar o modal
  const handleCloseDetails = () => {
    // Remove o parâmetro 'detalhes' da URL
    setSearchParams((prev) => {
      prev.delete("detalhes");
      return prev;
    });
  };

  return (
    <div className="">
      {/* ... (seu layout existente) ... */}

      {/* ... (Tabela/Cards de clientes) ... */}
      {/* No botão/menu que chama a função: */}
      <Dropdown.Item onClick={() => handleShowDetails(cliente)}>
        Sobre
      </Dropdown.Item>

      {/* ... */}

      {/* 6. ATUALIZE a renderização do Modal */}
      <ClientDetailsModal
        show={showDetailsModal}
        onHide={handleCloseDetails} // Usa a nova função de fechar
        cliente={selectedClient}
      />
    </div>
  );
}

export default Clientes;
```

## Vantagens desta abordagem

1.  **Simplicidade:** Tudo é resolvido em um único arquivo (`Cliente.jsx`).
2.  **Preservação de Estado:** Se você atualizar a página (F5) com o modal aberto, ele continuará aberto (desde que a lista de clientes seja carregada).
3.  **Compatibilidade:** Funciona perfeitamente com seus filtros e paginação existentes, pois usamos o `prev` no `setSearchParams` para não apagar outros parâmetros da URL.

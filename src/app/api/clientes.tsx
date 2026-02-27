import {
  useQueries,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const back = import.meta.env.VITE_BACKEND_URL;

async function getClientesfunc() {
  try {
    const clientes = await (
      await fetch(`${back}/clientes`, { method: "GET" })
    ).json();
    return clientes;
  } catch (error) {
    console.error("Erro ao buscar Clientes", error);
  }
}

async function postClients(data: any) {
  const response = await fetch(`${back}/cliente`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result.error || result.message || "Erro ao cadastrar cliente",
    );
  }
  return result;
}

async function putClient({ id, ...data }: { id: number; [key: string]: any }) {
  const response = await fetch(`${back}/cliente/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.status === 204) return null;

  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result.error || result.message || "Erro ao atualizar cliente",
    );
  }
  return result;
}

async function deleteClient(id: number) {
  const response = await fetch(`${back}/cliente/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Erro ao deletar cliente");
  }
}

//Querys

export const getClientes = () => {
  return useQuery({
    queryKey: ["clientes"],
    queryFn: getClientesfunc,
  });
};

export const postClientes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postClients,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
  });
};

export const putCliente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putClient,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      if (result?.cliente?.id) {
        queryClient.setQueryData(
          ["clientes", result.cliente.id],
          result.cliente,
        );
      }
    },
  });
};

export const deleteCliente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
  });
};

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import api from "@app/httpClient";

async function getClientesfunc() {
  try {
    return await api.get("/clientes");
  } catch (error) {
    console.error("Erro ao buscar Clientes", error);
  }
}

async function postClients(data: any) {
  try {
    return await api.post("/cliente", data);
  } catch (error) {
    console.error("Erro ao cadastrar cliente", error);
    throw error;
  }
}

async function putClient({ id, ...data }: { id: number; [key: string]: any }) {
  try {
    return await api.put(`/cliente/${id}`, data);
  } catch (error) {
    console.error("Erro ao atualizar cliente", error);
    throw error;
  }
}

async function deleteClient(id: number) {
  try {
    return await api.delete(`/cliente/${id}`);
  } catch (error) {
    console.error("Erro ao deletar cliente", error);
    throw error;
  }
}

// React Query
export const getClientes = () => useQuery({ queryKey: ["clientes"], queryFn: getClientesfunc });

export const postClientes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postClients,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["clientes"] }); },
  });
};

export const putCliente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putClient,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      if (result?.cliente?.id) {
        queryClient.setQueryData(["clientes", result.cliente.id], result.cliente);
      }
    },
  });
};

export const deleteCliente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["clientes"] }); },
  });
};

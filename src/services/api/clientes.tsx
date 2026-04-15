import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import api from "@services/http/client";
import { ApiResponse, Cliente, ClientePayload } from "@services/types";

async function getClientesfunc(): Promise<ApiResponse<Cliente[]>> {
  try {
    return await api.get("/clientes");
  } catch (err) { console.error("Erro na API", err); throw err; }
}

async function postClients(data: ClientePayload): Promise<ApiResponse<Cliente>> {
  try {
    return await api.post("/cliente", data);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

async function putClient({ id, ...data }: { id: number } & Partial<ClientePayload>): Promise<ApiResponse<{ cliente: Cliente }>> {
  try {
    return await api.put(`/cliente/${id}`, data);
  } catch (err) { console.error("Erro na API", err); throw err; }
}

async function deleteClient(id: number): Promise<ApiResponse> {
  try {
    return await api.delete(`/cliente/${id}`);
  } catch (err) { console.error("Erro na API", err); throw err; }
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

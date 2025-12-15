import { useQueries, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const back = import.meta.env.VITE_BACKEND_URL

async function getClientesfunc(){
    try{
        const clientes = await (await fetch(`${back}/clientes`, { method: "GET" })).json()
        return clientes
    } catch(error){
        console.error("Erro ao buscar Clientes", error)
    }
}

async function postClients(data: any){
    try{
        const response  = await fetch(`${back}/cliente`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        console.log(response)
        return await response.json()
    } catch (error){
        console.error("Erro ao cadastrar cliente", error)
    }
}

async function putClient(id: number, data: any){
    try{
        const response  = await fetch(`${back}/cliente/${id}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        //console.log(response)
        return await response.json()
    } catch (error){
        console.error("Erro ao atualizar cliente", error)
    }
}

async function deleteClient(id: number){
    try{
        await fetch(`${back}/cliente/${id}`, { method: "DELETE" })
    } catch(error){
        console.error("Erro ao deletar cliente", error)
    }
}

//Querys

export const getClientes = () => {
    return useQuery({
        queryKey: ["clientes"],
        queryFn: getClientesfunc,
    })
}

export const postClientes = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: postClients,
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ["clientes"] })
            // queryClient.setQueryData(["clientes", result.novoCliente.id], result.novoCliente);
        }
    })
}

export const putCliente = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: putClient,
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ["clientes"] })
            // 2. Opcional: Atualiza o cache do item específico diretamente para ser mais rápido
            queryClient.setQueryData(["clientes", result.id], result);
        }
    })
}

export const deleteCliente = () => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: deleteClient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clientes"] })
        }
    })
}

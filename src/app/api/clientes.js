const back = import.meta.env.VITE_BACKEND_URL

export async function getClientes(){
    try{
        const clientes = await (await fetch(`${back}/clientes`, { method: "GET" })).json()
        return clientes
    } catch(error){
        console.error("Erro ao buscar Clientes", error)
    }
}

export async function postClientes(data){
    try{
        const response  = await fetch(`${back}/cliente`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        //console.log(response)
        return response
    } catch (error){
        console.error("Erro ao cadastrar cliente", error)
    }
}

export async function deleteCliente(id){
    try{
        await fetch(`${back}/cliente/${id}`, { method: "DELETE" })
    } catch(error){
        console.error("Erro ao deletar cliente", error)
    }
}
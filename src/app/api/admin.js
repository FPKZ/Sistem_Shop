const back = import.meta.env.VITE_BACKEND_URL

export async function getUsers(){
    try{
        const response = await ( await fetch(`${back}/contas`, { method: "GET" })).json()
        return response
    } catch (err){
        console.error("Erro ao buscar Usuarios", err)
    }
}

export async function cadastrarUser(data){
    try{
        const response = await fetch(`${back}/cadastrar-conta`, { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })

        return await response.json()
    } catch(err){
        console.error("Erro ao cadastrar usuario", err)
    }
}

export async function editarUser(data){
    try{
        const response = await fetch(`${back}/editar-user/${data.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        return await response.json()
    } catch (err) {
        console.error("Erro ao editar usuario", err)
    }
}

export async function resetSenha(id){
    try{
        const response = await fetch(`${back}/reset-senha/${id}`, {method: "PUT"})
        return await response.json()
    } catch(err){
        console.error("Erro ao resetar senha", err)
    }
}

export async function deleteUser(id){
    try{
        const response = await fetch(`${back}/delete-user/${id}`, {method: "DELETE"})
        return await response.json()
    } catch(err){
        console.error("Erro ao deletar usuario", err)
    }
}

export async function getSolicitacoes(){
    try{
        const response = await ( await fetch(`${back}/pendentes`, { method: "GET" })).json()
        return response
    } catch (err){
        console.error("Erro ao buscar solicitações pendentes", err)
    }
}

export async function aproveSolicitacoes(id){
    try{
        const response = await fetch(`${back}/aprovar/${id}`, {method: "PUT"})
        return await response.json()
    } catch(err) {
        console.error("Erro ao aprovar proposta", err)
    }
}


export async function deleteSolicitacao(id){
    try{
        const response = await fetch(`${back}/negar/${id}`, { method: "DELETE"})
        return await response.json()
    } catch(err) {
        console.error("Erro ao recusar Solicitação", err)
    }
}

export async function registerUser(data){
    try{
        const response = await fetch(`${back}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        return await response.json()
    } catch(err) {
        console.error("Erro ao registrar usuario", err)
    }
}
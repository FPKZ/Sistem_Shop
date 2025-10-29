const back = import.meta.env.VITE_BACKEND_URL

 //venda
export async function getVendas(){
    try{
        const vendas = await ( await fetch(`${back}/vendas`, { method: "GET" })).json()
        return vendas
    } catch(error){
        console.error("Erro ao buscar Vendas",  error)
    }
}

export async function putVenda(data){
    try{
        const response  = await fetch(`${back}/venda`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        //console.log(response.status)
        return response
    } catch (error){
        console.error("Erro ao cadastrar venda", error)
    }
}

export async function deleteVenda(id){
    try{
        await fetch(`${back}/venda/${id}`, { method: "DELETE"})
    }catch(error){
        console.error("Erro ao deletar venda", error)
    }
}

//nota vendas

export async function getNotaVendas(){
    try{
        const notavendas = await ( await fetch(`${back}/notasVendas`, { method: "GET"})).json()
        return notavendas
    } catch(error){
        console.error("Erro ao buscar Notas Vendas", error)
    }
}

export async function putNotaVenda(data){
    try{
        const response  = await fetch(`${back}/notaVenda`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        //console.log(response.status)
        return response
    } catch (error){
        console.error("Erro ao cadastrar Nota Venda", error)
    }
}

export async function deleteNotaVenda(id){
    try{
        await fetch(`${back}/notaVenda/${id}`, { method: "DELETE" })
    } catch(error){
        console.error("Erro ao deleter Nota Venda", error)
    }
}
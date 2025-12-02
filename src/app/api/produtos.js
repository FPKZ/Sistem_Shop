const back = import.meta.env.VITE_BACKEND_URL

//Produtos
export async function getProduto({item = "", nome = ""} = {}){
    try{
        //console.log({item, nome})
        const produtos = await (
            await fetch(`${back}/produtos?itens=${item}&nome=${nome}`, { method: "GET" })
        ).json();
        //console.log(produtos);
        return produtos;
    } catch (error) {
        console.error("Erro ao buscar produtos", error)
    }
}

export async function postProduto(data){
    try{
        const response  = await fetch(`${back}/produto`, {
            method: "POST",
            body: data
        })
        const result = await response.json()
        //console.log(result.itensEstoque)
        return result
    } catch (error){
        console.error("Erro ao cadastrar produto", error)
    }
}


export async function reservarProduto(id){
    try{
        const response  = await fetch(`${back}/produto/reservar/${id}`, {
            method: "PUT"
        })
        const result = await response.json()
        return result
    } catch (error){
        console.error("Erro ao reservar produto", error)
    }
}


export async function deleteProduto(id){
    try{
        await fetch(`${back}/produto/${id}`, { method: "DELETE" });
    } catch (error){
        console.error("Erro ao deletar produto", error)
    }
}

//Categorias
export async function getCategoria(){
    try{
        const categorias = await (
            await fetch(`${back}/categorias`, { method: "GET" })
        ).json();
        //onsole.log(categorias);
        return categorias;
    } catch (error) {
        console.error("Erro ao buscar categorias", error)
    }
}

export async function postCategoria(data){
    try{
        const response  = await fetch(`${back}/categoria`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        //console.log(response.status)
        return await response.json()
    } catch (error){
        console.error("Erro ao cadastrar categoria", error)
    }
}

export async function deleteCategoria(id){
    try{
        await fetch(`${back}/categoria/${id}`, { method: "DELETE" })
    }catch(err){
        console.error("Erro ao deletar Categoria", err)
    }
}
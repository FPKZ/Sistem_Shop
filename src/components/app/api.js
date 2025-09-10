const back = "https://sistemshop-production.up.railway.app"

export default class API{
    
    static async getProduto(){
        try{
            const produtos = await (
                await fetch(`${back}/produtos`, { method: "GET" })
            ).json();
            console.log(produtos);
            return produtos;
        } catch (error) {
            console.error("Erro ao buscar produtos", error)
        }
    }

    static async putProduto(data){
        try{
            await fetch(`${back}/produto`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
        } catch (error){
            console.error("Erro ao cadastrar produto", error)
        }
    }

    static async deleteProduto(id){
        try{
            await fetch(`${back}/produto/${id}`, { method: "DELETE" });
        } catch (error){
            console.error("Erro ao deletar produto", error)
        }
    }
}
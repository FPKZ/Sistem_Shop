
 
const back = import.meta.env.VITE_BACKEND_URL

export default class API{
    
    static async getProduto(){
        try{
            const produtos = await (
                await fetch(`${back}/produtos`, { method: "GET" })
            ).json();
            //console.log(produtos);
            return produtos;
        } catch (error) {
            console.error("Erro ao buscar produtos", error)
        }
    }

    static async postProduto(data){
        try{
            const response  = await fetch(`${back}/produto`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            console.log(response.status)
            return response
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
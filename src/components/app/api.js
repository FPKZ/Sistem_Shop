
export default class API{
    
    static async getProduto(){
        try{
            const produtos = await (
                await fetch(`https://sistemshop-production.up.railway.app/produtos`, { method: "GET" })
            ).json();
            console.log(produtos);
            return produtos;
        } catch (error) {
            console.error("Erro ao buscar produtos", error)
        }
    }

    static async putProduto(data){
        try{
            await fetch(`https://sistemshop-production.up.railway.app/produto`, {
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
            await fetch(`https://sistemshop-production.up.railway.app/produto/${id}`, { method: "DELETE" });
        } catch (error){
            console.error("Erro ao deletar produto", error)
        }
    }
}
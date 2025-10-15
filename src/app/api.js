
 
const back = import.meta.env.VITE_BACKEND_URL

export default class API{
    //Produtos
    static async getProduto({item = "", nome = ""} = {}){
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

    static async postProduto(data){
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

    static async deleteProduto(id){
        try{
            await fetch(`${back}/produto/${id}`, { method: "DELETE" });
        } catch (error){
            console.error("Erro ao deletar produto", error)
        }
    }
    
    //Categorias
    static async getCategoria(){
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

    static async postCategoria(data){
        try{
            const response  = await fetch(`${back}/categoria`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            //console.log(response.status)
            return response
        } catch (error){
            console.error("Erro ao cadastrar categoria", error)
        }
    }
    
    static async deleteCategoria(id){
        try{
            await fetch(`${back}/categoria/${id}`, { method: "DELETE" })
        }catch(err){
            console.error("Erro ao deletar Categoria", err)
        }
    }

    //Notas
    static async getNotas(){
        try{
            const notas = await (
                await fetch(`${back}/notas`, { method: "GET" })
            ).json();
            //console.log(notas);
            return notas;
        } catch (error) {
            console.error("Erro ao buscar notas", error)
        }
    }

    static async postNota(data){
        try{
            const response  = await fetch(`${back}/nota`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            //console.log(response.status)
            return response
        } catch (error){
            console.error("Erro ao cadastrar nota", error)
        }
    }

    static async deleteNotas(id){
        try{
            await fetch(`${back}/nota/${id}`, {method: "DELETE"})
        } catch(err){
            console.error("Erro ao deletar Nota", err)
        }
    }

    //Clientes
    static async getClientes(){
        try{
            const clientes = await (await fetch(`${back}/clientes`, { method: "GET" })).json()
            return clientes
        } catch(error){
            console.error("Erro ao buscar Clientes", error)
        }
    }

    static async postClientes(data){
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

    static async deleteCliente(id){
        try{
            await fetch(`${back}/cliente/${id}`, { method: "DELETE" })
        } catch(error){
            console.error("Erro ao deletar cliente", error)
        }
    }

    //venda
    static async getVendas(){
        try{
            const vendas = await ( await fetch(`${back}/vendas`, { method: "GET" })).json()
            return vendas
        } catch(error){
            console.error("Erro ao buscar Vendas",  error)
        }
    }

    static async putVenda(data){
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
    
    static async deleteVenda(id){
        try{
            await fetch(`${back}/venda/${id}`, { method: "DELETE"})
        }catch(error){
            console.error("Erro ao deletar venda", error)
        }
    }

    //nota vendas
    static async getNotaVendas(){
        try{
            const notavendas = await ( await fetch(`${back}/notasVendas`, { method: "GET"})).json()
            return notavendas
        } catch(error){
            console.error("Erro ao buscar Notas Vendas", error)
        }
    }
    
    static async putNotaVenda(data){
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

    static async deleteNotaVenda(id){
        try{
            await fetch(`${back}/notaVenda/${id}`, { method: "DELETE" })
        } catch(error){
            console.error("Erro ao deleter Nota Venda", error)
        }
    }

    static async login(data){
        try{
            // console.log(data)
            const response = await fetch(`${back}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            const result = await response.json()
            return result
        }
        catch(error){
            console.error("Erro ao fazer login", error)
        }
    }

    static async postConta(data){
        try{
            const response = await fetch(`${back}/conta`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            const result = await response.json()
            return result
        }
        catch(error){
            console.error("Erro ao cadastrar conta", error)
        }
    }
}
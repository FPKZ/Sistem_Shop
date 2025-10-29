const back = import.meta.env.VITE_BACKEND_URL

export async function getNotas(){
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

export async function postNota(data){
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

export async function deleteNotas(id){
    try{
        await fetch(`${back}/nota/${id}`, {method: "DELETE"})
    } catch(err){
        console.error("Erro ao deletar Nota", err)
    }
}
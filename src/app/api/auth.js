const back = import.meta.env.VITE_BACKEND_URL

export async function login(data){
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

export async function postConta(data){
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
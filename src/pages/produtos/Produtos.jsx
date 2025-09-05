import { useState, useEffect } from "react"
import Header from "../../components/Header"
import Menu from "../../components/Menu"
import Produto from "./components/Produto"

async function api(params) {
    // await fetch(`http://localhost:3333/videos`, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //         titulo: "video01",
    //         descricao: "adfasdasd",
    //         duracao: 120
    //     })
    // })

    const produtos = await (await fetch(`http://localhost:3333/videos?query=`, { method: "GET"})).json()
    console.log(Array.isArray(produtos))
    return produtos
    
}

function Produtos() {
    const [produtos, setProdutos] = useState([])

    function deleteProduto(id){
        fetch(`http://localhost:3333/videos/${id}`, {method: "DELETE"})
    }

    useEffect(() => {
        async function puxar(){
            const p = await api()
            setProdutos(p)
        }
        puxar()

    }, [])
    
    return (
        <>
            <Header />
            <Menu />
            <h1>Produtos Page</h1>
            <Produto produtos={produtos} deleteProduto={deleteProduto}/>
        </>
    )
}

export default Produtos
import { useState, useMemo } from "react"

export const useFiltroOrdenacao = (dadosIniciais, camposFiltragem) => {
    const [ filtro, setFiltro ] = useState("")
    const [ order, setOrder ] = useState({ chave: "id", direcao: "asc" })
    
    
    const dadosProcessados = useMemo(() => {
        let dadosFiltrados = [...dadosIniciais]

        if(filtro) {
            dadosFiltrados = dadosFiltrados.filter(item => {
                return camposFiltragem.some(campoConfig => {

                    if(typeof campoConfig === "string"){
                        const valorCampo = campoConfig.split('.').reduce((obj, key) => obj && obj[key], item)
                        return typeof valorCampo === "string" && valorCampo.toLowerCase().includes(filtro.toLowerCase())
                    }
                    if(typeof campoConfig === "object" && campoConfig.path && Array.isArray(campoConfig.subCampos)){
                        const valorArray = campoConfig.path.split(".").reduce((obj, key) => obj && obj[key, item])

                        if(Array.isArray(valorArray)){
                            return valorArray.some(subItem => {
                                return campoConfig.subCampos.some(subCampo => {
                                    const valorSubCampo = subCampo.split(".").reduce((obj, key) => obj && obj[key], subItem)
                                    return typeof valorSubCampo === "string" && valorSubCampo.toLowerCase().includes(filtro.toLowerCase())

                                })
                            })
                        }
                    }
                    return false
                })
            })
        }
        dadosFiltrados.sort((a, b) => {
            const valorA = a[order.chave]
            const valorB = b[order.chave]

            if(valorA < valorB) return order.direcao === "asc" ? -1 : 1
            if(valorA > valorB) return order.direcao === "asc" ? 1 : -1
            return 0
        })

        return dadosFiltrados
    }, [dadosIniciais, filtro, order, camposFiltragem])
    
    const requisitarOrdenacao = (chave) => {
        let direcao = "asc"
        if (order.chave === chave && order.direcao === "asc"){
            direcao = "desc"
        }
        setOrder({chave, direcao})
    }
    return {
        filtro,
        setFiltro,
        order,
        dadosProcessados,
        requisitarOrdenacao,
    }
}
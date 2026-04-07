import { useEffect, useRef } from "react"



/**
 * Hook para adicionar suporte ao botão "Voltar" (popstate) do navegador/celular
 * fechando automaticamente modais abertos sem voltar de página real.
 * 
 * @example
 * const [isModalAberto, setModalAberto] = useState(false);
 * usePopStateModal([isModalAberto], [setModalAberto]);
 * 
 * @param {Array<boolean>} modals - Array dos estados booleanos dos modais.
 * @param {Array<Function>} funcs - Array com as funções setter(false) correspondentes aos modais.
 */
export default function usePopStateModal(modals, funcs){

    const modalsRef = useRef(funcs)
    modalsRef.current = funcs

    useEffect(() => {
        const handlePopState = () => {
            modalsRef.current.forEach(funcs => funcs(false))
        }

        const isAnyModalOpen = modals.some(modal => modal)

        if(isAnyModalOpen) {
            if(window.history.state?.source !== "usePopStateModal") {
                window.history.pushState({ source: "usePopStateModal" }, "")
            }
            window.addEventListener("popstate", handlePopState)
        }

        return () => {
            window.removeEventListener("popstate", handlePopState)
        }

    },[JSON.stringify(modals)])
    
}
import { useEffect, useRef } from "react"



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
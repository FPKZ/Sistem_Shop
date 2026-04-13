import { Button } from "react-bootstrap"
import { useState } from "react"

export default function HoverBtn({mobile, upClass, children, func}){
    const [hovered, setHovered] = useState(false)
    

    return (
    <Button type="button" className={`btn-roxo animed-btn ${upClass} ${hovered ? "expanded" : ""}`}
        onClick={() => {
            if(mobile){
                if(hovered){
                    func?.(true)
                    setHovered?.(false)
                } else {
                    setHovered?.(true)
                    setTimeout(() => setHovered?.(false), 3000)
                }
            } else {
                func?.(true)
            }
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>

        <i className="bi bi-plus-lg me-2"></i>
        <span className="text">
            {children}
        </span>
    </Button>
    )
}

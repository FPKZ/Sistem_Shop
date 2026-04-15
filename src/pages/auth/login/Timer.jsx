import utils from "@services/utils"
import { useState, useEffect } from "react"
import { Card } from "react-bootstrap"

export default function Timer({stop, setStop}){

    const [ timer, setTimer ] = useState(0)
    

    useEffect(() => {
        let interval;
        if (stop) {
        interval = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);
        } else {
            console.log(utils.formatTimer(timer))
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [stop]);


    return(
        <div style={{ textAlign: "center", fontFamily: "sans-serif" }}>
            <h2>⏱️ Timer</h2>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                {utils.formatTimer(timer)}
            </div>
            <button onClick={() => setStop(!stop)}>
                {stop ? "⏸️ Pausar" : "▶️ Iniciar"}
            </button>
            <button onClick={() => setTimer(0)} style={{ marginLeft: "0.5rem" }}>
                🔄 Resetar
            </button>
        </div>
    )
}

import { useState } from "react"
import API from "@app/api"
import { useNavigate } from "react-router-dom"
import { Button, Col } from "react-bootstrap"
import { useToast } from "@contexts/ToastContext"
import { useLoadRequest } from "@hooks/useLoadRequest"

export default function Clientes(){

    const [formValue, setFormValue] = useState({})
    const [erros, setErros] = useState({})
    const [validated, setValidated] = useState(false)

    const navigate = useNavigate()
    const { showToast } = useToast()    
    const [ isLoading, request ] = useLoadRequest()

    function handleChange(e){
        // eslint-disable-next-line no-unused-vars
        const { name, value, type } = e.target
        let newValue = value

        if(name === "telefone"){
            let digits = value.replace(/\D/g, "")
            if(digits.length > 11) digits = digits.slice(0,11)

            if (digits.length === 0) {
                newValue = "";
            } else if (digits.length <= 2) {
            newValue = `(${digits}`;
            } else if (digits.length <= 6) {
            newValue = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
            } else if (digits.length <= 10) {
            newValue = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
            } else {
            newValue = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
            }
        }


        if(name === "nome"){
            newValue = value
            .toLowerCase()
            .replace(/\b\w/g, (letra) => letra.toUpperCase());
        }

        if (name === "email") {
            newValue = value.trim();
          }

        setFormValue({
            ...formValue,
            [name]: newValue,
        })
    }

    function validate(form){
        let newErrors = {};
        
        const elements = form.querySelectorAll("[name]")
        
        elements.forEach((e) => {
            const { name, value, required, type } = e

            if(required && !value.trim()){
                newErrors[name] = "Campo obrigatório!"
            }

            if (name === "email" && value && !value.includes("@") && !value.includes(".")) {
                newErrors[name] = "E-mail inválido";
            }
            
            if (type == "number" && value && isNaN(value)){
                newErrors[name] = "Digite um valor numerico valido"
            }
        })
        return newErrors
    }


     const handleSubimit = async (e) => {
        e.preventDefault()
        const form = e.target;

        const newErrors = validate(form)
        setErros(newErrors)
        setValidated(true)
        //console.log(erros)
        //console.log(validated)

        if(Object.keys(newErrors).length === 0){
            const formData = new FormData(e.target)
            const data = Object.fromEntries(formData.entries())

            await request(async () => {
                try{
                    const responsta = await API.postClientes(data)

                    if(responsta.ok) {
                        showToast(responsta.message, "success")
                        navigate(-1)
                    }else {
                        if(responsta.message){
                            showToast(responsta.message || responsta.error, "error")
                        }
                    }
                } catch(err){
                    console.error(err)
                    showToast(err, "error")
                }
            })
            
        }
    }

    return(
        <>
            <form onSubmit={handleSubimit} noValidate className="">
                <div className="row p-3 pt-0 m-0 gap-4">
                    <Col md={12} className="p-0">
                        <label htmlFor="nome" className="form-label">Nome</label>
                        <input type="text" className={`form-control ${validated ? (erros.nome ? `is-invalid` : `is-valid`) : "" }`} id="nome" name="nome" value={formValue.nome || ""} onChange={handleChange} placeholder="Nome" required/>
                    </Col>
                    <Col md={4} className="p-0">
                        <label htmlFor="email" className="form-label">E-mail</label>
                        <input type="email" className={`form-control`} id="email" name="email" value={formValue.email || ""} onChange={handleChange} placeholder="E-mail" />
                    </Col>
                    <Col className="p-0">
                        <label htmlFor="tell" className="form-label">Telefone</label>
                        <input type="tel" className={`form-control ${validated ? (erros.telefone ? `is-invalid` : `is-valid`) : "" }`} id="tell" name="telefone" value={formValue.telefone || ""} onChange={handleChange} placeholder="Telefone" required/>
                    </Col>
                    <Col md={5} className="p-0">
                        <label htmlFor="endereco" className="form-label">Endereço</label>
                        <input type="text" className={`form-control`} id="endereco" name="endereco" placeholder="Endereco" />
                    </Col>
                    <Button variant="outline-secondary" className="btn btn-roxo" disabled={isLoading} type="submit">Adicionar</Button>
                </div>
            </form>
        </>
    )
}
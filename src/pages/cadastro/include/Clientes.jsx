import { useState } from "react"
import API from "@app/api"
import { useNavigate } from "react-router-dom"
import { Button, Col } from "react-bootstrap"
import { useToast } from "@contexts/ToastContext"

export default function Clientes(){

    const [formValue, setFormValue] = useState({})
    const [erros, setErros] = useState({})
    const [validated, setValidated] = useState(false)

    const navigate = useNavigate()
    const { showToast } = useToast()

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
            console.log(data)
            const responsta = await API.postClientes(data)
            console.log(responsta)
            if(responsta.ok) {
                showToast(responsta.message, "success")
                navigate(-1)
            }else {
                if(responsta.message){
                    showToast(responsta.message, "error")
                }
            }
        }
    }

    return(
        <>
            <div className="row w-100 p-3 d-flex gap-4">
                <form onSubmit={handleSubimit} noValidate className="row d-flex flex-wrap w-100 gap-3 justify-content-center align-content-center">
                    <Col md={12} className="p-0">
                        <label htmlFor="nome" className="form-label">Nome</label>
                        <input type="text" className={`form-control ${validated ? (erros.nome ? `is-invalid` : `is-valid`) : "" }`} id="nome" name="nome" value={formValue.nome || ""} onChange={handleChange} placeholder="Nome" required/>
                    </Col>
                    <Col md={4} className="p-0">
                        <label htmlFor="email" className="form-label">E-mail</label>
                        <input type="email" className={`form-control ${validated ? (erros.email ? `is-invalid` : `is-valid`) : "" }`} id="email" name="email" value={formValue.email || ""} onChange={handleChange} placeholder="E-mail" required/>
                    </Col>
                    <Col className="p-0">
                        <label htmlFor="tell" className="form-label">Telefone</label>
                        <input type="tel" className={`form-control ${validated ? (erros.telefone ? `is-invalid` : `is-valid`) : "" }`} id="tell" name="telefone" value={formValue.telefone || ""} onChange={handleChange} placeholder="Telefone" required/>
                    </Col>
                    <Col md={5} className="p-0">
                        <label htmlFor="endereco" className="form-label">Endereço</label>
                        <input type="text" className={`form-control ${validated ? (erros.endereco ? `is-invalid` : `is-valid`) : "" }`} id="endereco" name="endereco" placeholder="Endereco" required/>
                    </Col>
                    <Button className="btn btn-roxo" type="submit">Adicionar</Button>
                </form>
            </div>
        </>
    )
}
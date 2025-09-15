import { useState } from "react"

export default function Clientes(){

    const [formValue, setFormValue] = useState({})
    const [erros, setErros] = useState({})
    const [validated, setValidated] = useState(false)

    function handleChange(e){
        const { name, value } = e.target
        if(name === 'categoria') console.log('1')
        setFormValue({
            ...formValue,
            [name]: value,
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
            
            if (type == "number" && value && isNaN(value)){
                newErrors[name] = "Digite um valor numerico valido"
            }
        })
        return newErrors
    }


    function handleSubimit(e){
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
            //cadastrarProduto(data_refatorada)
        }
    }

    return(
        <>
            <div className="row w-100 p-3 d-flex gap-4">
                <form onSubmit={handleSubimit} noValidate className="row d-flex flex-wrap w-100 gap-3 justify-content-center align-content-center">
                    <div className="col-md-12 p-0">
                        <label htmlFor="nome" className="form-label">Nome</label>
                        <input type="text" className={`form-control ${validated ? (erros.nome ? `is-invalid` : `is-valid`) : "" }`} id="nome" name="nome" placeholder="Nome" required/>
                    </div>
                    <div className="col-md-4 p-0">
                        <label htmlFor="email" className="form-label">E-mail</label>
                        <input type="text" className={`form-control ${validated ? (erros.email ? `is-invalid` : `is-valid`) : "" }`} id="email" name="email" placeholder="E-mail" required/>
                    </div>
                    <div className="col-md p-0">
                        <label htmlFor="tell" className="form-label">Telefone</label>
                        <input type="" className={`form-control ${validated ? (erros.telefone ? `is-invalid` : `is-valid`) : "" }`} id="tell" name="telefone" placeholder="Telefone" required/>
                    </div>
                    <div className="col-md-5 p-0">
                        <label htmlFor="endereco" className="form-label">Endereço</label>
                        <input type="text" className={`form-control ${validated ? (erros.endereco ? `is-invalid` : `is-valid`) : "" }`} id="endereco" name="endereco" placeholder="Endereco" required/>
                    </div>
                    <button className="btn btn-roxo" type="submit">Adicionar</button>
                </form>
            </div>
        </>
    )
}
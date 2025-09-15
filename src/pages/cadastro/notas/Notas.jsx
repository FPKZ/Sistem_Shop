import { useState } from "react"

export default function Notas(){
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
        <div className="row w-100 p-3 d-flex gap-4">
            <form onSubmit={handleSubimit} noValidate className="row d-flex flex-wrap w-100 gap-3">
                <div className="col-sm col-md-12 p-0">
                    <label htmlFor="numeroNota"  className="form-label">Numero da Nota</label>
                    <input type="text" className={`form-control ${validated ? (erros.codigo ? `is-invalid` : `is-valided`): ""}`} name="codigo" id="numeroNota" required/>
                </div>
                <div className="col-sm col-md-2 p-0">
                    <label htmlFor="valor_total" className="form-label">Valor da Nota</label>
                    <input type="number" className={`form-control ${validated ? (erros.valor_total ? `is-invalid` : `is-valided`): ""}`} name="valor_total" id="valor_total" required/>
                </div>
                <div className="col-sm col-md-2 p-0">
                    <label htmlFor="data" className="form-label">Data da nota</label>
                    <input type="date" className={`form-control ${validated ? (erros.data ? `is-invalid` : `is-valided`): ""}`} name="data" id="data" required/>
                </div>
                <div className="col-sm col-md-3 p-0">
                    <label htmlFor="quantidade" className="form-label">Quantidade de produtos da nota</label>
                    <input type="number" className={`form-control ${validated ? (erros.quantidade ? `is-invalid` : `is-valided`): ""}`} name="quantidade" id="quantidade" required/>
                </div>
                <button className="btn btn-roxo" type="submit">Adicionar</button>
            </form>
        </div>
    )
}
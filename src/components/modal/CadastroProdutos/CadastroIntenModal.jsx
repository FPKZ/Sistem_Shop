import API from "@app/api";
import { useState, useEffect } from "react";
import { Modal, Row, Col, Button, Form, Dropdown, InputGroup } from "react-bootstrap";
import CadastroCategoria from "@components/modal/CadastroCategoria/CadastroCategoria";
import ProdutosCriados from "@components/modal/ProdutosCriados/ProdutosCriados";
import { useLoadRequest } from "@hooks/useLoadRequest";

function CadastroIntenModal({
  visible,
  onClose,
  cadastrarProduto,
  cadastroNota = false,
}) {
  const [formValue, setFormValue] = useState({ quantidade: 1 });
  const [erros, setErros] = useState({});
  const [validated, setValidated] = useState(false);

  const [notas, setNotas] = useState([]);
  const [nota, setNota] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState({});
  const [modalCadastroCategoria, setModalCadastroCategoia] = useState(false);
  
  const [modalCriar, setModalCriar] = useState(false);
  const [itensCriados, setItensCriados] = useState(null);

  const [ isLoading, request ] = useLoadRequest()
  
  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => {
        setValidated(false);
        setErros({});
        setFormValue({ quantidade: 1 });
        setNota({});
        setCategoria({});
        setItensCriados(null);
      }, 200);
      return () => clearTimeout(timer);
    }

    !cadastroNota && GetNotas();
    GetCategorias();
  }, [visible, modalCadastroCategoria]);

  const GetCategorias = async () => {
    const data = await API.getCategoria();
    setCategorias(data);
  };
  const GetNotas = async () => {
    const data = await API.getNotas();
    setNotas(data);
  };

  if (!visible) return null;

  function handleChange(e) {
    const { name, value, type, files } = e.target;
    setFormValue((prev) => {
      const updatedValues = {
        ...prev,
        [name]: type === "file" ? files[0] : value,
      };

      const valorCompra = parseFloat(updatedValues.valor_compra) || 0;
      const lucro = parseFloat(updatedValues.lucro) || 0;
      const valorVenda = parseFloat(updatedValues.valor_venda) || 0;

      if (name === "valor_venda") {
        if (valorCompra > 0) {
          updatedValues.lucro = (valorVenda - valorCompra).toFixed(2);
        }
      } else if (name === "lucro") {
        if (valorCompra > 0) {
          updatedValues.valor_venda = (valorCompra + lucro).toFixed(2);
        }
      } else if (name === "valor_compra") {
        if (valorVenda > 0) {
          updatedValues.lucro = (valorVenda - valorCompra).toFixed(2);
        } else if (lucro > 0) {
          updatedValues.valor_venda = (valorCompra + lucro).toFixed(2);
        }
      }

      return updatedValues;
    });
  }

  function validate(form) {
    let newErrors = {};
    const elements = form.querySelectorAll("[name]");
    elements.forEach((e) => {
      const { name, value, required, type } = e;
      if (required && !value.trim()) {
        newErrors[name] = "Campo obrigatório!";
      }
      if (type == "number" && value && isNaN(value)) {
        newErrors[name] = "Digite um valor numerico valido";
      }
    });
    return newErrors;
  }

  async function handleSubimit(e) {
    e.preventDefault();
    const form = e.target;
    const newErrors = validate(form);
    setErros(newErrors);
    setValidated(true);

    if (Object.keys(newErrors).length === 0) {
      
      await request(async () => {
        const quantidade = parseInt(formValue.quantidade) || 1;
        let allItensCriados = [];
  
        try {
          for (let i = 0; i < quantidade; i++) {
              const finalFormData = new FormData();
              finalFormData.append("nome", formValue.nome);
              finalFormData.append("descricao", formValue.descricao);
              finalFormData.append("img", formValue.img);
              finalFormData.append("categoria_id", categoria.id || "");
  
              const itens = [
              {
                  codigo_barras: formValue.codigo_barras,
                  nota_id: nota.id || "",
                  tamanho: formValue.tamanho,
                  cor: formValue.cor,
                  marca: formValue.marca,
                  valor_compra: formValue.valor_compra,
                  valor_venda: formValue.valor_venda,
                  lucro: formValue.lucro,
              },
              ];
              finalFormData.set("itens", JSON.stringify(itens));
  
              if (cadastroNota) {
                  await cadastrarProduto(finalFormData);
              } else {
                  const response = await cadastrarProduto(finalFormData);
                  if (response && response.ok && response.itensEstoque) {
                      allItensCriados = allItensCriados.concat(response.itensEstoque);
                  }
              }
          }
  
          if (cadastroNota) {
              onClose();
          } else {
              if (allItensCriados.length > 0) {
                  setItensCriados(allItensCriados);
                  setModalCriar(true);
              } else {
                  onClose();
              }
          }
        } catch (error) {
          console.error(error);
        } 
      })
    }
  }

  function NotaItems({ notas, setNota }) {
    return (
        <>
        {notas.map((n) => (
            <Dropdown.Item key={n.id} onClick={() => setNota(n)}>
            {n.codigo}
            </Dropdown.Item>
        ))}
        </>
    );
  }

  function CategoriaItems({ categorias, setCategoria }) {
    return (
        <>
        {categorias.map((c) => (
            <Dropdown.Item key={c.id} onClick={() => setCategoria(c)}>
            {c.nome}
            </Dropdown.Item>
        ))}
        </>
    );
  }

  return (
    <>
    <Modal
      show={visible && !modalCriar}
      onHide={onClose}
      size="xl"
      centered
      fullscreen="md-down"
      animation
    >
      <Form onSubmit={handleSubimit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3 mb-3 pb-4 border-bottom">
             <Col xs={12}>
                <Form.Label htmlFor="nomeProduto">Nome</Form.Label>
                <Form.Control
                    className={validated ? (erros.nome ? "is-invalid" : "is-valid") : ""}
                    name="nome"
                    id="nomeProduto"
                    type="text"
                    placeholder="Nome do produto"
                    value={formValue.nome || ""}
                    onChange={handleChange}
                    required
                />
             </Col>
             <Col xs={10} md={4}>
                <Form.Label htmlFor="imgProduto">Imagem</Form.Label>
                <Form.Control
                    name="img"
                    id="imgProduto"
                    type="file"
                    onChange={handleChange}
                />
             </Col>
             <Col xs={2} md={1} className="d-flex flex-column align-items-center">
                <Form.Label htmlFor="corProduto">Cor</Form.Label>
                <Form.Control
                    className="form-control-color"
                    name="cor"
                    id="corProduto"
                    type="color"
                    value={formValue.cor || "#000000"}
                    onChange={handleChange}
                />
             </Col>
             <Col xs={12} md={3}>
                <Form.Label htmlFor="categoriaProduto">Categoria</Form.Label>
                <Dropdown>
                    <Dropdown.Toggle
                        variant="outline-secondary"
                        className={`w-100 d-flex justify-content-between align-items-center ${
                        validated ? (erros.categoria ? "is-invalid" : "is-valid") : ""
                        }`}
                    >
                        {categoria.nome || "Selecione a Categoria"}
                    </Dropdown.Toggle>
                    <Form.Control
                        id="categoriaProduto"
                        type="hidden"
                        name="categoria"
                        value={categoria.id || ""}
                        required
                    />
                    <Dropdown.Menu className="w-100">
                        <CategoriaItems categorias={categorias} setCategoria={setCategoria} />
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => setModalCadastroCategoia(true)}>
                            Nova Categoria
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
             </Col>
             <Col xs={6} md={2}>
                <Form.Label htmlFor="marcaProduto">Marca</Form.Label>
                <Form.Control
                    className={validated ? (erros.marca ? "is-invalid" : "is-valid") : ""}
                    name="marca"
                    id="marcaProduto"
                    type="text"
                    placeholder="Marca"
                    value={formValue.marca || ""}
                    onChange={handleChange}
                    required
                />
             </Col>
             <Col xs={6} md={2}>
                <Form.Label htmlFor="tamanhoProduto">Tamanho</Form.Label>
                <Form.Control
                    className={validated ? (erros.tamanho ? "is-invalid" : "is-valid") : ""}
                    name="tamanho"
                    id="tamanhoProduto"
                    type="text"
                    value={formValue.tamanho || ""}
                    onChange={handleChange}
                    placeholder="Tamanho"
                    required
                />
             </Col>
          </Row>

          <Row className="g-3 mb-3 pb-4 border-bottom">
             {!cadastroNota && (
                 <Col xs={12} md={4}>
                    <Form.Label htmlFor="notaProduto">Nota</Form.Label>
                    <Dropdown>
                        <Dropdown.Toggle
                            variant="outline-secondary"
                            className={`w-100 d-flex justify-content-between align-items-center ${
                            validated ? (erros.nota ? "is-invalid" : "is-valid") : ""
                            }`}
                        >
                            {nota.codigo || "Selecione a Nota"}
                        </Dropdown.Toggle>
                        <Form.Control
                            id="notaProduto"
                            type="hidden"
                            name="nota"
                            value={nota.id || ""}
                            required
                        />
                        <Dropdown.Menu className="w-100">
                            <NotaItems notas={notas} setNota={setNota} />
                        </Dropdown.Menu>
                    </Dropdown>
                 </Col>
             )}
             
             <Col xs={10} md={!cadastroNota ? 6 : 9}>
                <Form.Label htmlFor="codigoBarras">Código de Barras</Form.Label>
                <Form.Control
                    className={validated ? (erros.codigo_barras ? "is-invalid" : "is-valid") : ""}
                    name="codigo_barras"
                    id="codigoBarras"
                    type="number"
                    placeholder="Código de Barras"
                    value={formValue.codigo_barras || ""}
                    onChange={handleChange}
                    required
                />
             </Col>
             
             <Col xs={2} md={!cadastroNota ? 2 : 3}>
                <Form.Label htmlFor="quantidadeProduto">Qtd.</Form.Label>
                <Form.Control
                    name="quantidade"
                    id="quantidadeProduto"
                    type="text"
                    placeholder="G"
                    value={formValue.quantidade}
                    onChange={handleChange}
                    required
                />
             </Col>
             
             <Col xs={4} md={4}>
                <Form.Label htmlFor="valorCompraProduto">Vlr. Compra</Form.Label>
                <InputGroup>
                    <InputGroup.Text>R$</InputGroup.Text>
                    <Form.Control
                        className={validated ? (erros.valor_compra ? "is-invalid" : "is-valid") : ""}
                        name="valor_compra"
                        id="valorCompraProduto"
                        type="number"
                        placeholder="0.00"
                        value={formValue.valor_compra || ""}
                        onChange={handleChange}
                        required
                    />
                </InputGroup>
             </Col>
             
             <Col xs={4} md={4}>
                <Form.Label htmlFor="valorVendaProduto">Vlr. Venda</Form.Label>
                <InputGroup>
                    <InputGroup.Text>R$</InputGroup.Text>
                    <Form.Control
                        className={validated ? (erros.valor_venda ? "is-invalid" : "is-valid") : ""}
                        name="valor_venda"
                        id="valorVendaProduto"
                        type="number"
                        placeholder="0.00"
                        value={formValue.valor_venda || ""}
                        onChange={handleChange}
                        required
                    />
                </InputGroup>
             </Col>
             
             <Col xs={4} md={4}>
                <Form.Label htmlFor="LucroProduto">Lucro</Form.Label>
                <InputGroup>
                    <InputGroup.Text>R$</InputGroup.Text>
                    <Form.Control
                        className={validated ? (erros.lucro ? "is-invalid" : "is-valid") : ""}
                        name="lucro"
                        id="LucroProduto"
                        type="number"
                        placeholder="0.00"
                        value={formValue.lucro || ""}
                        onChange={handleChange}
                        required
                    />
                </InputGroup>
             </Col>
          </Row>
          
          <Row className="g-3 mb-3">
             <Col xs={12}>
                <Form.Label htmlFor="descricaoProduto">Descrição</Form.Label>
                <Form.Control
                    className={validated ? (erros.descricao ? "is-invalid" : "is-valid") : ""}
                    name="descricao"
                    type="text"
                    id="descricaoProduto"
                    placeholder="Descrição"
                    value={formValue.descricao || ""}
                    onChange={handleChange}
                    required
                />
             </Col>
          </Row>

        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-roxo w-100" type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
    
    <CadastroCategoria
      visible={modalCadastroCategoria}
      onClose={() => setModalCadastroCategoia(false)}
    />
    
    <ProdutosCriados
        visible={modalCriar}
        onClose={() => {
            setModalCriar(false);
            onClose();
        }}
        itens={itensCriados}
    />
    </>
  );
}

export default CadastroIntenModal;

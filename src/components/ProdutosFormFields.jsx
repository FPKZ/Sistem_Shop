import { Row, Col, Form, Button, Dropdown, InputGroup } from "react-bootstrap";
import { Autocomplete, TextField } from "@mui/material";
import { Cores } from "@components/Cores";
import ImageCropModal from "@components/modal/ImageCropModal";
import GerenciarImagensModal from "@components/modal/GerenciarImagensModal";

/**
 * Componente visual para os campos do formulário de produtos.
 * Recebe toda a lógica via props, mantendo-se como um componente "Dumb" (apresentação).
 */
export default function ProdutosFormFields({ 
    formValue, 
    erros, 
    validated, 
    cores, 
    notas, 
    categorias,
    produtos,
    isProdutoExistente,
    handleSelectProduto,
    pricing,        // Novo: contém valorCompra, valorVenda, lucro e seus handlers
    imageUpload,    // Novo: contém estado e handlers da imagem
    handleChange, 
    setModalCadastroCategoria,
    setModalCadastroNota,
    cadastroNota,
    isLoading,
    modalImagens,
    setModalImagens,
    activeTabModalImagens,
    setActiveTabModalImagens,
    removeImagem
}) {
    const { valorCompra, valorVenda, lucro, handlers: pHandlers } = pricing;
    const { handlers: iHandlers } = imageUpload;
    const porcentagem = valorCompra.value > 0
        ? ((lucro.value / valorCompra.value) * 100).toFixed(2)
        : "0.00";
    return (
        <>
            <GerenciarImagensModal
                visible={modalImagens}
                onClose={() => setModalImagens(false)}
                imagens={formValue.imgs}
                onRemove={removeImagem}
                activeTab={activeTabModalImagens}
                onTabChange={setActiveTabModalImagens}
                imageUpload={imageUpload}
            />

            <ImageCropModal
                src={imageUpload.cropSrc}
                visible={imageUpload.showCrop}
                onClose={iHandlers.handleCropCancel}
                onConfirm={iHandlers.handleCropConfirm}
                aspect={1}
            />

            <Row className="g-3 mb-3 pb-4 border-bottom">
                <Col xs={12}>
                    <Form.Label htmlFor="nomeProduto">Nome</Form.Label>
                    {/* {console.log(produtos)} */}
                    <Autocomplete
                        freeSolo
                        id="nomeProduto"
                        options={produtos || []}
                        getOptionLabel={(option) => typeof option === 'string' ? option : (option.nome || "")}
                        onChange={handleSelectProduto}
                        onInputChange={(event, newInputValue, reason) => {
                            if (reason === 'input' || reason === 'clear') {
                                handleChange({ target: { name: 'nome', value: newInputValue } });
                            }
                        }}
                        value={produtos?.find(p => p.nome === formValue.nome) || formValue.nome || ""}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Nome do produto"
                                required
                                error={validated && !!erros.nome}
                                variant="standard"
                                // Usamos slotProps (MUI v5.14+) ou InputProps com segurança
                                InputProps={{
                                    ...params.InputProps, // Mantém os comportamentos do Autocomplete
                                    disableUnderline: true,
                                    className: `form-control ${params.InputProps?.className || ""} ${validated ? (erros.nome ? "is-invalid" : "is-valid") : ""}`,
                                    style: { 
                                        padding: '0.375rem 0.75rem', 
                                        height: '38px', // Altura padrão do form-control Bootstrap
                                        display: 'flex',
                                        alignItems: 'center'
                                    }
                                }}
                                sx={{
                                    // Remove as linhas que o MUI coloca antes e depois do foco
                                    '& .MuiInput-root:before': { display: 'none' },
                                    '& .MuiInput-root:after': { display: 'none' },
                                    '& .MuiInput-root:hover:not(.Mui-disabled):before': { display: 'none' },

                                    '& .MuiInput-root': { 
                                        marginTop: '0 !important',
                                        backgroundColor: 'white',
                                        borderRadius: '0.375rem',
                                        transition: 'border-color .15s ease-in-out, box-shadow .15s ease-in-out'
                                    },
                                    '& .MuiInput-input': { 
                                        padding: '0.5rem !important',
                                        // Garante que o texto ocupe o espaço correto
                                    },
                                    // Simulação do Focus do Bootstrap
                                    '& .MuiInput-root.Mui-focused': {
                                        borderColor: '#86b7fe',
                                        boxShadow: '0 0 0 0.25rem rgba(13, 110, 253, 0.25)',
                                    }
                                }}
                            />
                        )}
                    />
                </Col>

                <Col xs={10} md={4}>
                    <Form.Label htmlFor="imgProduto">Imagens</Form.Label>
                    <InputGroup>
                        <div
                            className={`form-control d-flex align-items-center gap-2 px-3 py-2 ${
                                imageUpload.erro ? "is-invalid" : formValue.imgs?.length > 0 ? "is-valid" : ""
                            } ${isProdutoExistente ? "opacity-50 bg-light" : ""}`}
                            style={{ cursor: isProdutoExistente ? "not-allowed" : "pointer", minHeight: "38px" }}
                            onClick={() => {
                                if (isProdutoExistente) return;
                                setActiveTabModalImagens("adicionar");
                                setModalImagens(true);
                            }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (isProdutoExistente) return;
                                if (e.key === "Enter") {
                                    setActiveTabModalImagens("adicionar");
                                    setModalImagens(true);
                                }
                            }}
                        >
                            <i className="bi bi-plus-lg text-muted" />
                            <span
                                className="text-truncate small"
                                style={{ color: "#adb5bd" }}
                            >
                                Adicionar imagem
                            </span>
                        </div>
                        <Button 
                            variant="outline-secondary" 
                            className="d-flex align-items-center gap-1"
                            disabled={isProdutoExistente}
                            onClick={() => {
                                setActiveTabModalImagens("galeria");
                                setModalImagens(true);
                            }}
                        >
                            <i className="bi bi-images"></i>
                            <span className="badge bg-secondary">{formValue.imgs?.length || 0}</span>
                        </Button>
                    </InputGroup>
                    {imageUpload.erro && <div className="invalid-feedback d-block">{imageUpload.erro}</div>}
                    {formValue.imgs?.length > 0 && !imageUpload.erro && (
                        <div className="valid-feedback d-block">Clique em gerenciar para ver as imagens.</div>
                    )}
                </Col>

                <Col xs={2} md={1} className="d-flex flex-column align-items-center">
                    <Form.Label htmlFor="corProduto">Cor</Form.Label>
                    <Dropdown>
                        <Dropdown.Toggle
                            variant="none"
                            disabled={isProdutoExistente}
                            className={`dropdown-toggle-none w-100 d-flex justify-content-center align-items-center border-0 p-0 ${
                                validated ? (erros.cor ? "is-invalid" : "is-valid") : ""
                            }`}
                        >
                            <div className="d-flex flex-column align-items-center gap-1">
                                <div 
                                    style={{
                                        backgroundColor: formValue.cor || 'transparent', 
                                        width: '2.3rem',
                                        height: '2.3rem',
                                        borderRadius: '50%',
                                        boxShadow: '0 0 0 1px #666666',
                                        overflow: 'hidden'
                                    }} 
                                >
                                    {formValue.cor === null && (
                                        <svg width="100%" height="100%" viewBox="0 0 10 10" fill="none">
                                            <line x1="10" y1="0" x2="0" y2="10" stroke="black" strokeWidth="1" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </Dropdown.Toggle>
                        <Form.Control id="corProduto" type="hidden" name="cor" value={formValue.cor || ""} required />
                        <Dropdown.Menu className="p-0 shadow-sm" style={{ width: '320px' }}>
                            <Cores cores={cores} formValue={formValue} handleChange={handleChange} />
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>

                <Col xs={12} md={3}>
                    <Form.Label htmlFor="categoriaProduto">Categoria</Form.Label>
                    <Dropdown>
                        <Dropdown.Toggle
                            variant="none"
                            disabled={isProdutoExistente}
                            className={`form-select w-100 d-flex justify-content-between align-items-center dropdown-toggle-none ${
                                isProdutoExistente ? "bg-light" : "bg-white"
                            } ${
                                validated ? (erros.categoria_id ? "is-invalid" : "is-valid") : ""
                            }`}
                        >
                            {categorias.find(c => c.id === formValue.categoria_id)?.nome || "Selecione a Categoria"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="w-100">
                            <Categoria categorias={categorias} handleChange={handleChange} />
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => setModalCadastroCategoria(true)}>Nova Categoria</Dropdown.Item>
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
                        value={formValue.marca}
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
                        value={formValue.tamanho}
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
                                variant="none"
                                className={`form-select w-100 d-flex justify-content-between align-items-center bg-white dropdown-toggle-none ${
                                    validated ? (erros.nota_id ? "is-invalid" : "is-valid") : ""
                                }`}
                            >
                                {notas.find(n => n.id === formValue.nota_id)?.codigo || "Selecione a Nota"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="w-100">
                                <Nota notas={notas} handleChange={handleChange} />
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={() => setModalCadastroNota(true)}>Nova Nota</Dropdown.Item>
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
                        value={formValue.codigo_barras}
                        onChange={handleChange}
                        required
                    />
                </Col>

                <Col xs={2} md={!cadastroNota ? 2 : 3}>
                    <Form.Label htmlFor="quantidadeProduto">Qtd.</Form.Label>
                    <Form.Control
                        name="quantidade"
                        id="quantidadeProduto"
                        type="number"
                        placeholder="1"
                        min="1"
                        value={formValue.quantidade}
                        onChange={handleChange}
                        required
                    />
                </Col>

                <Col xs={6} md={4}>
                    <Form.Label htmlFor="valorCompraProduto">Vlr. Compra</Form.Label>
                    <InputGroup className={`overflow-hidden ${validated ? (erros.valor_compra ? "border border-danger rounded-2" : "border border-success rounded-2") : "border rounded-2"}`}>
                        <InputGroup.Text className="bg-transparent border-0 text-muted">R$</InputGroup.Text>
                        <Form.Control
                            className={`border-0 shadow-none ${validated ? (erros.valor_compra ? "is-invalid" : "is-valid") : ""}`}
                            name="valor_compra"
                            id="valorCompraProduto"
                            type="text"
                            placeholder="R$ 0,00"
                            value={valorCompra.displayValue}
                            onChange={pHandlers.handleValorCompraChange}
                            required
                        />
                    </InputGroup>
                </Col>

                <Col xs={6} md={4}>
                    <Form.Label htmlFor="valorVendaProduto">Vlr. Venda</Form.Label>
                    <InputGroup className={`overflow-hidden ${validated ? (erros.valor_venda ? "border border-danger rounded-2" : "border border-success rounded-2") : "border rounded-2"}`}>
                        <InputGroup.Text className="bg-transparent border-0 text-muted">R$</InputGroup.Text>
                        <Form.Control
                            className={`border-0 shadow-none ${validated ? (erros.valor_venda ? "is-invalid" : "is-valid") : ""}`}
                            name="valor_venda"
                            id="valorVendaProduto"
                            type="text"
                            placeholder="R$ 0,00"
                            value={valorVenda.displayValue}
                            onChange={pHandlers.handleValorVendaChange}
                            required
                        />
                    </InputGroup>
                </Col>

                <Col xs={12} md={4}>
                    <Form.Label htmlFor="LucroProduto">Lucro</Form.Label>
                    <InputGroup className={`overflow-hidden ${validated ? (erros.lucro ? "border border-danger rounded-2" : "border border-success rounded-2") : "border rounded-2"}`}>
                        <InputGroup.Text className="bg-transparent border-0 text-muted">R$</InputGroup.Text>
                        <Form.Control
                            className={`border-0 shadow-none ${validated ? (erros.lucro ? "is-invalid" : "is-valid") : ""}`}
                            name="lucro"
                            id="LucroProduto"
                            type="text"
                            placeholder="R$ 0,00"
                            value={lucro.displayValue}
                            onChange={pHandlers.handleLucroChange}
                            required
                        />
                        <InputGroup.Text className="bg-transparent border-0 text-muted">{porcentagem}%</InputGroup.Text>
                    </InputGroup>
                </Col>
            </Row>

            <Row className="g-3 mb-3">
                <Col xs={12}>
                    <Form.Label htmlFor="descricaoProduto">Descrição</Form.Label>
                    <Form.Control
                        className={validated ? (erros.descricao ? "is-invalid" : "is-valid") : ""}
                        name="descricao"
                        as="textarea"
                        rows={4}
                        disabled={isProdutoExistente}
                        style={{ resize: "none" }}
                        id="descricaoProduto"
                        placeholder="Descrição do produto"
                        value={formValue.descricao}
                        onChange={handleChange}
                        required
                    />
                </Col>
            </Row>

            {!cadastroNota && (
                <Row>
                    <Col xs={12}>
                        <Button variant="outline-secondary" className="btn-roxo w-100" disabled={isLoading} type="submit">
                            {isLoading ? "Salvando..." : "Salvar"}
                        </Button>
                    </Col>
                </Row>
            )}
        </>
    );
}

function Nota({ notas, handleChange }) {
    return (
        <>
            {notas.map((nota) => (
                <Dropdown.Item key={nota.id} onClick={() => handleChange("nota_id", nota.id)}>
                    {nota.codigo}
                </Dropdown.Item>
            ))}
        </>
    );
}

function Categoria({ categorias, handleChange }) {
    return (
        <>
            {categorias.map((categoria) => (
                <Dropdown.Item key={categoria.id} onClick={() => handleChange("categoria_id", categoria.id)}>
                    {categoria.nome}
                </Dropdown.Item>
            ))}
        </>
    );
}

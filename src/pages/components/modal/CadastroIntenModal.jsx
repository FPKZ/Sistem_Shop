// components/CadastroModal.jsx
import './cadastroItenModal.css';

export default function CadastroModal({ visible, onClose, onSubmit }) {
  if (!visible) return null;

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h2>Cadastrar Item</h2>
        <form onSubmit={handleSubmit}>
          <input name="nome" placeholder="Nome do item" required />
          <input name="descricao" placeholder="Descrição" required />
          <input name="cor" placeholder="Cor" required />
          <input name="imagem" id="imagem" type="file" accept="image/*" />
          <input name='tamanho' placeholder='Tamanho' />
          <input name="valor_venda" placeholder="Valor de Venda" type="number" step="0.01" required />
          <input name="valor_compra" placeholder="Valor de Compra" type="number" step="0.01" required />
          <input name="estoque_atual" placeholder="Estoque Atual" type="number" required />
          <input name="codigo_barras" placeholder="Código de Barras" />
          <input name="categoria_id" placeholder="ID da Categoria" type="number" required />
          <button type="submit">Salvar</button>
        </form>
        <button className="fechar" onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}

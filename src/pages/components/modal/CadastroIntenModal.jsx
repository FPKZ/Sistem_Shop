// components/CadastroModal.jsx
import './CadastroItenModal.css';

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
          <button type="submit">Salvar</button>
        </form>
        <button className="fechar" onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}

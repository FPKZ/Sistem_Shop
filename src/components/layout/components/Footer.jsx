export default function Footer() {
  return (
    <footer
      id="footer"
      className="bg-[#710c85] text-white py-5 mt-auto"
    >
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-md-4 text-center text-md-start">
            <h5 className="fw-bold mb-3">Sistem Shop</h5>
            <p className="small opacity-75">
              Sua melhor experiência de compra online. Produtos de qualidade com as melhores condições do mercado.
            </p>
          </div>
          <div className="col-12 col-md-4 text-center">
            <h5 className="fw-bold mb-3">Links Rápidos</h5>
            <ul className="list-unstyled small opacity-75">
              <li className="mb-2"><a href="/" className="text-white text-decoration-none">Início</a></li>
              <li className="mb-2"><a href="/catalogo" className="text-white text-decoration-none">Catálogo</a></li>
              <li className="mb-2"><a href="/carrinho" className="text-white text-decoration-none">Meu Carrinho</a></li>
            </ul>
          </div>
          <div className="col-12 col-md-4 text-center text-md-end">
            <h5 className="fw-bold mb-3">Contato</h5>
            <div className="small opacity-75">
              <p className="mb-2">WhatsApp: (11) 98765-4321</p>
              <p className="mb-2">Email: suporte@sistemshop.com.br</p>
              <p className="mb-0">Atendimento: Seg-Sex, 08h às 18h</p>
            </div>
          </div>
        </div>
        <hr className="my-4 opacity-25" />
        <div className="row">
          <div className="col-12 text-center">
            <p className="small mb-0 opacity-50">&copy; 2026 Sistem Shop. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

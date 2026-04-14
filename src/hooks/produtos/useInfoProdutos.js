import { useState, useEffect, useRef } from "react";

/**
 * Hook de estado de UI do modal de informações de produto (InfoProdutos).
 * Gerencia: item selecionado no estoque e abas de navegação.
 *
 * Upload e remoção de imagens são responsabilidade do useEditarProduto —
 * este hook recebe `imageUpload` e `removeImagem` via composição.
 *
 * @param {boolean} visible   - Se o modal pai está visível.
 * @param {boolean} tableShow - Se a tabela lateral está sendo exibida.
 * @param {object}  produto   - Produto selecionado vindo do pai.
 */
export default function useInfoProdutos({ visible, tableShow, produto }) {
  const [itemEstoque, setItemEstoque] = useState({});
  const detailsRef = useRef(null);

  // Estado da aba ativa no painel de detalhes
  const [activeTab, setActiveTab] = useState("tecnico");

  // Estado do modal de gerenciar imagens
  const [modalImagens, setModalImagens] = useState(false);
  const [activeTabModalImagens, setActiveTabModalImagens] = useState("galeria");

  // Normaliza o produto para item de estoque quando não há tabela lateral
  useEffect(() => {
    if (visible && !tableShow && produto) {
      // Se o produto vier do fluxo de nota (objeto com array 'itens'),
      // normalizamos para que as propriedades do primeiro item sejam acessíveis no nível raiz
      if (
        produto.itens &&
        Array.isArray(produto.itens) &&
        produto.itens.length > 0
      ) {
        const itemPrincipal = produto.itens[0];
        setItemEstoque({
          ...itemPrincipal,
          imgs:      produto.imgs,      // Preserva as imagens do objeto pai
          img:       produto.img,       // Preserva a imagem principal do objeto pai
          nome:      produto.nome,      // Preserva o nome do objeto pai
          descricao: produto.descricao, // Preserva a descrição
          ...produto,                   // Sobrescreve com o resto para redundância
        });
      } else {
        setItemEstoque(produto);
      }
    }
  }, [visible, tableShow, produto]);

  // Reseta o item selecionado ao trocar de produto (ID diferente)
  useEffect(() => {
    if (visible && tableShow) setItemEstoque({});
  }, [visible, produto?.id, tableShow]);

  // Sincroniza o itemEstoque atual com os dados novos do produto pai (ex: após mutations)
  // Isso evita que a UI mostre dados antigos (como fotos antigas) após uma edição.
  useEffect(() => {
    if (visible && tableShow && itemEstoque?.id && produto?.itens) {
      const itemAtualizado = produto.itens.find(i => i.id === itemEstoque.id);
      if (itemAtualizado) {
        setItemEstoque({
          ...itemAtualizado,
          imgs:      produto.imgs,      // Atualiza com as novas imagens do pai
          img:       produto.img,       // Atualiza a nova capa do pai
          nome:      produto.nome,      // Atualiza o nome
          descricao: produto.descricao, // Atualiza a descrição
          ...produto,                   // Mantém redundância de dados do pai
        });
      }
    }
  }, [produto]); // Resincroniza sempre que o objeto produto mudar de referência (refresh do cache)

  // Reseta o scroll da área de detalhes ao trocar de item
  useEffect(() => {
    if (visible && detailsRef.current) {
      detailsRef.current.scrollTop = 0;
    }
  }, [visible, itemEstoque?.id, itemEstoque?._id]);

  return {
    itemEstoque,
    setItemEstoque,
    detailsRef,
    activeTab,
    setActiveTab,
    modalImagens,
    setModalImagens,
    activeTabModalImagens,
    setActiveTabModalImagens,
  };
}

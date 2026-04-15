import { useState, useCallback, useEffect } from "react";
import { useToast } from "@contexts/ToastContext";
import API from "@services";
import { useForm } from "@hooks/useForm";
import useImageUpload from "@hooks/produtos/useImageUpload";

/**
 * Hook de lógica para edição de um produto existente.
 * Usa useMutation do React Query para invalidar o cache automaticamente após a edição.
 *
 * @param {object}   produto   - Produto atual (dados iniciais para o formulário).
 * @param {Function} onSuccess - Callback chamado após edição bem-sucedida.
 */
export default function useEditarProduto(produto, onSuccess) {
  const { showToast } = useToast();
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // ─── Mutation (React Query) ───────────────────────────────────────────────
  const mutation = API.useAtualizarProduto();

  // ─── Formulário (pré-populado com o produto atual) ───────────────────────
  const {
    formValue,
    erros,
    setErros,
    validated,
    setValidated,
    handleChange,
    validate,
    setFormValue,
  } = useForm(
    {
      nome:          produto?.nome          ?? "",
      descricao:     produto?.descricao     ?? "",
      img:           produto?.img           ?? "",
      imgs:          produto?.imgs          ?? [],
      categoria_id:  produto?.categoria_id  ?? null,
    },
    {
      validators: {
        nome:          (v) => (!v?.trim()            ? "Campo obrigatório!" : null),
        categoria_id:  (v) => (v == null             ? "Campo obrigatório!" : null),
        descricao:     (v) => (!v?.trim()            ? "Campo obrigatório!" : null),
      },
    }
  );


  // Sincroniza o formValue quando produto muda (seleção diferente ou refetch do cache)
  // Garante que campos como imgs nunca fiquem com dados do produto anterior.
  useEffect(() => {
    if (!produto?.id) return;
    setFormValue({
      nome:          produto.nome          ?? "",
      descricao:     produto.descricao     ?? "",
      img:           produto.img           ?? "",
      imgs:          produto.imgs          ?? [],
      categoria_id:  produto.categoria_id  ?? null,
    });
  }, [produto?.id, setFormValue]);


  // ─── Upload de Imagens ────────────────────────────────────────────────────
  // Após o upload no Blob, persiste o array imgs atualizado no produto via mutation.
  const imageUpload = useImageUpload(async (file) => {
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const response = await API.postImagens([file]);
      if (response?.ok && response.data) {
        const novasUrls = response.data || [];
        const imgsAtualizadas = [...(produto?.imgs ?? formValue.imgs ?? []), ...novasUrls];

        // Atualiza o formValue visualmente
        setFormValue((prev) => ({ ...prev, imgs: imgsAtualizadas }));

        // Persiste no banco com o array completo
        mutation.mutate(
          { id: produto?.id, data: buildPayload({ imgs: imgsAtualizadas }) },
          {
            onSuccess: () => showToast("Imagem adicionada com sucesso!", "success"),
            onError: (error) => showToast(error?.message || "Erro ao salvar a imagem.", "error"),
          }
        );
      }
    } catch (error) {
      console.error("Erro no upload de imagem:", error);
      showToast("Erro no upload da imagem.", "error");
    } finally {
      setIsUploadingImage(false);
    }
  });

  // ─── Montagem do Payload ──────────────────────────────────────────────────
  // Centraliza a construção do payload, aceitando overrides pontuais.
  // Assim handleSubmit e updateImage reutilizam a mesma lógica sem duplicar campos.
  const buildPayload = useCallback((overrides = {}) => ({
    nome:          formValue.nome,
    descricao:     formValue.descricao,
    img:           formValue.img,
    imgs:          formValue.imgs, // Usar o imgs do formValue que é atualizado pelos handlers
    categoria_id:  formValue.categoria_id,
    ...overrides, // sobrescreve apenas o que foi passado
  }), [formValue]);

  // ─── Atualizar Capa ───────────────────────────────────────────────────────
  const updateImage = useCallback((url) => {
    if (!url || mutation.isPending) return;

    // Atualiza visualmente o form para refletir a nova capa na UI
    setFormValue((prev) => ({ ...prev, img: url }));

    mutation.mutate(
      { id: produto?.id, data: buildPayload({ img: url }) },
      {
        onSuccess: (response) => {
          showToast(response?.message || "Imagem de capa atualizada!", "success");
        },
        onError: (error) => {
          showToast(error?.message || "Erro ao atualizar a imagem.", "error");
        },
      }
    );
  }, [mutation, buildPayload, produto?.id, setFormValue, showToast]);

  // ─── Remoção de Imagens ───────────────────────────────────────────────────
  // Deleta do Blob e persiste o array imgs sem a URL removida no banco.
  const removeImagem = useCallback(async (url) => {
    const response = await API.deleteImagem(url);
    if (response?.ok) {
      const imgsAtualizadas = (produto?.imgs ?? formValue.imgs ?? []).filter((img) => img !== url);

      // Atualiza o formValue visualmente
      setFormValue((prev) => ({ ...prev, imgs: imgsAtualizadas }));

      // Persiste no banco com o array sem a imagem removida
      mutation.mutate(
        { id: produto?.id, data: buildPayload({ imgs: imgsAtualizadas }) },
        {
          onSuccess: () => showToast("Imagem removida com sucesso!", "success"),
          onError: (error) => showToast(error?.message || "Erro ao remover a imagem.", "error"),
        }
      );
    }
  }, [mutation, buildPayload, produto, formValue.imgs, setFormValue, showToast]);

  // ─── Submissão ────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (isUploadingImage || mutation.isPending) return;
    if (!validate()) return;

    mutation.mutate(
      { id: produto?.id, data: buildPayload() },
      {
        onSuccess: (response) => {
          showToast(
            response?.message || "Produto atualizado com sucesso!",
            "success"
          );
          if (onSuccess) onSuccess(response?.data);
        },
        onError: (error) => {
          showToast(
            error?.message || "Erro ao atualizar o produto.",
            "error"
          );
        },
      }
    );
  }, [
    isUploadingImage,
    mutation,
    validate,
    buildPayload,
    produto?.id,
    showToast,
    onSuccess,
  ]);

  return {
    // Formulário
    formValue,
    erros,
    validated,
    handleChange,
    setFormValue,
    setValidated,
    setErros,

    // Imagens
    imageUpload,
    removeImagem,
    isUploadingImage,
    updateImage,

    // Estado geral
    isLoading: mutation.isPending || isUploadingImage,
    isSuccess: mutation.isSuccess,
    isError:   mutation.isError,

    // Ações
    handleSubmit,
  };
}

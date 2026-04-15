import { useEffect, useCallback } from "react";
import { useToast } from "@contexts/ToastContext";
import { useForm } from "@hooks/useForm";
import useProductPricing from "@hooks/produtos/useProductPricing";
import { useAtualizarItemEstoque } from "@services/api/produtos";

/**
 * Hook de lógica para edição de um item de estoque individual.
 * 
 * @param {object}   item      - Item de estoque atual.
 * @param {boolean}  visible   - Se o modal está visível (usado para resetar o form).
 * @param {Function} onSuccess - Callback chamado após sucesso.
 */
export default function useEditarItemEstoque(item, visible, onSuccess) {
    const { showToast } = useToast();
    const mutation = useAtualizarItemEstoque();

    // ─── Precificação ─────────────────────────────────────────────────────────
    const pricing = useProductPricing({
        valor_compra: item?.valor_compra,
        valor_venda: item?.valor_venda,
    });
    const { valorCompra, valorVenda, lucro } = pricing;

    // ─── Formulário ───────────────────────────────────────────────────────────
    const {
        formValue,
        handleChange,
        setFormValue,
        validate,
        erros,
        validated,
        setValidated,
        setErros
    } = useForm({
        marca: item?.marca || "",
        tamanho: item?.tamanho || "",
        cor: item?.cor || null,
        codigo_barras: item?.codigo_barras || "",
    }, {
        validators: {
            marca: (v) => (!v?.trim() ? "Campo obrigatório!" : null),
            tamanho: (v) => (!v?.trim() ? "Campo obrigatório!" : null),
            codigo_barras: (v) => (!v?.toString().trim() ? "Campo obrigatório!" : null),
        }
    });

    // Sincroniza o formValue apenas quando o item ou a visibilidade muda
    useEffect(() => {
        if (visible && item?.id) {
            setFormValue({
                marca: item.marca || "",
                tamanho: item.tamanho || "",
                cor: item.cor || null,
                codigo_barras: item.codigo_barras || "",
            });
            valorCompra.setValue(item.valor_compra || 0);
            valorVenda.setValue(item.valor_venda || 0);
            lucro.setValue((item.valor_venda || 0) - (item.valor_compra || 0));
            setValidated(false);
            setErros({});
        }
    }, [item?.id, visible]); // Dependências estáveis para evitar loop infinito

    // ─── Submissão ────────────────────────────────────────────────────────────
    const handleSubmit = useCallback(async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        
        if (!validate()) return;

        const payload = {
            ...formValue,
            valor_compra: valorCompra.value,
            valor_venda: valorVenda.value,
            lucro: lucro.value,
        };

        mutation.mutate({ id: item.id, data: payload }, {
            onSuccess: (response) => {
                showToast(response?.message || "Item atualizado com sucesso!", "success");
                if (onSuccess) onSuccess(response?.data);
            },
            onError: (err) => {
                showToast(err?.message || "Erro ao atualizar item.", "error");
            }
        });
    }, [formValue, valorCompra.value, valorVenda.value, lucro.value, mutation, item?.id, validate, showToast, onSuccess]);

    return {
        // Formulário
        formValue,
        handleChange,
        erros,
        validated,
        
        // Precificação
        pricing,
        
        // Estado Geral
        isLoading: mutation.isPending,
        
        // Ações
        handleSubmit
    };
}

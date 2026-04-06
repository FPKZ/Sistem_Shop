import { useModal } from "../contexts/ModalContext";

/**
 * Hook para facilitar o uso do modal de confirmação global.
 * @returns {object} - Objeto com a função openModal
 */
export default function useModalConfirm() {
    const { showConfirm } = useModal();

    const openModal = (title, message, actions = {}) => {
        showConfirm({
            title,
            message,
            onConfirm: actions.confirm || actions, // Suporte para o novo formato ou callback direto
            onCancel: actions.cancel
        });
    };

    return {
        openModal,
        // Mantendo compatibilidade de nomes com o que o usuário já escreveu, 
        // embora não sejam mais necessários para renderização manual.
        modalConfirm: false,
        title: "",
        message: "",
        handleConfirm: () => {},
        handleCancel: () => {},
    };
}

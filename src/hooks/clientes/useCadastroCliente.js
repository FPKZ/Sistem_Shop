import API from "@app/api";
import { useForm } from "@hooks/useForm";
import { useRequestHandler } from "@hooks/useRequestHandler";

export function useCadastroCliente(onSuccess, clienteParaEditar = null) {
  const { isLoading, handleRequest } = useRequestHandler();

  // Configuração de transformações (MÁSCARAS)
  const transformers = {
    telefone: (value) => {
      let digits = value.replace(/\D/g, "");
      if (digits.length > 11) digits = digits.slice(0, 11);
      if (digits.length === 0) return "";
      if (digits.length <= 2) return `(${digits}`;
      if (digits.length <= 6)
        return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      if (digits.length <= 10)
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    },
    nome: (value) =>
      value.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()),
  };

  // Configuração de VALIDAÇÕES (Seguindo lógica do modal)
  const validators = {
    nome: (v) => (!v?.trim() ? "Campo obrigatório!" : null),
    email: (v) => {
      if (!v?.trim()) return null; // E-mail opcional
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !emailRegex.test(v) ? "E-mail inválido" : null;
    },
    telefone: (v) => (!v?.trim() ? "Campo obrigatório!" : null),
  };

  const { formValue, setFormValue, erros, validated, handleChange, validate } =
    useForm(clienteParaEditar || {}, { transformers, validators });

  const criarMutation = API.postClientes();
  const editarMutation = API.putCliente();

  const handleSubimit = async (e) => {
    e.preventDefault();

    if (validate()) {
      const isEditing = !!clienteParaEditar;
      const mutation = isEditing ? editarMutation : criarMutation;
      const data = isEditing
        ? { id: clienteParaEditar.id, ...formValue }
        : formValue;

      try {
        await handleRequest(() => mutation.mutateAsync(data), {
          successMessage: isEditing
            ? "Cliente atualizado com sucesso"
            : "Cliente criado com sucesso",
          showSuccessToast: true,
        });

        if (onSuccess) onSuccess();
      } catch (error) {
        console.error("Erro na operação de cliente:", error);
      }
    }
  };

  return {
    formValue,
    setFormValue,
    erros,
    validated,
    isLoading: isLoading || criarMutation.isPending || editarMutation.isPending,
    handleChange,
    handleSubimit,
  };
}

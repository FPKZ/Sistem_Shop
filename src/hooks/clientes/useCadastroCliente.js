import API from "@app/api";
import { useForm } from "@hooks/useForm";
import { useRequestHandler } from "@hooks/useRequestHandler";

export function useCadastroCliente(navigate) {
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

  // Configuração de VALIDAÇÕES
  const validators = {
    nome: (v) => (!v?.trim() ? "Campo obrigatório!" : null),
    email: (v) => {
      if (!v?.trim()) return "Campo obrigatório!";
      if (!v.includes("@") || !v.includes(".")) return "E-mail inválido";
      return null;
    },
    telefone: (v) => (!v?.trim() ? "Campo obrigatório!" : null),
  };

  const { formValue, erros, validated, handleChange, validate } = useForm(
    {},
    { transformers, validators },
  );

  const handleSubimit = async (e) => {
    e.preventDefault();

    if (validate()) {
      const response = await handleRequest(() => API.postClientes(formValue));
      if (response?.ok) {
        navigate(-1);
      }
    }
  };

  return {
    formValue,
    erros,
    validated,
    isLoading,
    handleChange,
    handleSubimit,
  };
}

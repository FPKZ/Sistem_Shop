import { useNavigate } from "react-router-dom";
import API from "@services";
import { useForm } from "@hooks/useForm";
import { useRequestHandler } from "@hooks/useRequestHandler";

export function useCadastroUser() {
  const navigate = useNavigate();
  const { isLoading, handleRequest } = useRequestHandler();

  const validators = {
    nome: (v) => (!v?.trim() ? "Campo obrigatório!" : null),
    email: (v) => {
      if (!v?.trim()) return "Campo obrigatório!";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(v)) return "Não é um e-mail válido";
      return null;
    },
    senha: (v) => {
      if (!v?.trim()) return "Campo obrigatório!";
      if (v.length < 6) return "A senha deve ter pelo menos 6 caracteres";
      return null;
    },
    confirmSenha: (v, form) => {
      if (!v?.trim()) return "Campo obrigatório!";
      if (v !== form.senha) return "As senhas não coincidem";
      return null;
    },
  };

  const { formValue, erros, validated, handleChange, validate } = useForm(
    {},
    { validators },
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      const response = await handleRequest(() => API.cadastrarUser(formValue), {
        successMessage: "Usuário cadastrado com sucesso!",
      });

      if (response?.ok) {
        navigate("/login");
      }
    }
  };

  return {
    formValue,
    erros,
    validated,
    isLoading,
    handleChange,
    handleSubmit,
  };
}

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@auth-sistem/AuthContext";
import { useForm } from "@hooks/useForm";
import { useRequestHandler } from "@hooks/useRequestHandler";

export function useLogin() {
  const { login } = useAuth();
  const { isLoading: stop, handleRequest } = useRequestHandler();
  const navigate = useNavigate();
  const location = useLocation();

  const validators = {
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
  };

  const {
    formValue,
    erros,
    setErros,
    validated,
    setValidated,
    handleChange,
    validate,
  } = useForm({}, { validators });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      const response = await handleRequest(() => login(formValue), {
        showSuccessToast: false, // Login geralmente não mostra toast de sucesso, apenas redireciona
      });

      if (response?.ok) {
        const from = location.state?.from?.pathname || "/painel";
        navigate(from, { replace: true });
      } else if (response) {
        setErros(
          response || {
            login: "Email ou senha inválidos",
            email: "skip",
            senha: "skip",
          },
        );
        setValidated(true);
      }
    }
  };

  return {
    formValue,
    erros,
    validated,
    stop,
    handleChange,
    handleSubmit,
  };
}

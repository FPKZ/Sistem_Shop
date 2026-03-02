import API from "@app/api";
import { useForm } from "@hooks/useForm";
import { useRequestHandler } from "@hooks/useRequestHandler";

export function usePerfil() {
  const { handleRequest } = useRequestHandler();

  // Usamos useForm para os dados do perfil
  const perfilForm = useForm(
    {
      nome: "João da Silva",
      email: "joao.silva@example.com",
    },
    {
      validators: {
        nome: (v) => (!v?.trim() ? "Campo obrigatório!" : null),
        email: (v) => (!v?.trim() ? "Campo obrigatório!" : null),
      },
    },
  );

  // Usamos useForm para a troca de senha
  const passwordForm = useForm(
    {
      current: "",
      new: "",
      confirm: "",
    },
    {
      validators: {
        current: (v) => (!v ? "Senha atual obrigatória" : null),
        new: (v) => (v?.length < 6 ? "Mínimo 6 caracteres" : null),
        confirm: (v, form) => (v !== form.new ? "Senhas não coincidem" : null),
      },
    },
  );

  const handlePerfilSubmit = async (e) => {
    e.preventDefault();
    if (perfilForm.validate()) {
      // Simulação de update via handler genérico
      await handleRequest(async () => {
        // API.updatePerfil(perfilForm.formValue)
        return { ok: true, message: "Informações atualizadas com sucesso!" };
      });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.validate()) {
      await handleRequest(async () => {
        // API.changePassword(passwordForm.formValue)
        return { ok: true, message: "Senha atualizada com sucesso!" };
      });
      passwordForm.resetForm();
    }
  };

  return {
    perfilData: perfilForm.formValue,
    passwords: passwordForm.formValue,
    perfilErrors: perfilForm.erros,
    passwordErrors: passwordForm.erros,
    handlePerfilChange: perfilForm.handleChange,
    handlePasswordChange: passwordForm.handleChange,
    handlePerfilSubmit,
    handlePasswordSubmit,
  };
}

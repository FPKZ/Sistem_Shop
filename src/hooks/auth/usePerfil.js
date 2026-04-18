import API from "@services";
import { useEffect, useState } from "react";
import { useForm } from "@hooks/useForm";
import { useRequestHandler } from "@hooks/useRequestHandler";
import { useAuth } from "@auth-sistem/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@contexts/ToastContext";
import useImageUpload from "@hooks/produtos/useImageUpload";

export function usePerfil() {
  const  [ edit, setEdit ] = useState(false);
  const  [ openPassword, setOpenPassword ] = useState(false);
  const { handleRequest } = useRequestHandler();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { user, logout } = useAuth();
  
  // Hook para upload e recorte de imagem
  const imageUpload = useImageUpload(async (file) => {
    if (file) {
      const response = await API.postImagens([file]);
      if (response?.ok && response.data?.[0]) {
        perfilForm.handleChange("img", response.data[0]);
      }
    }
  });

  // Sincroniza o formulário quando os dados do usuário carregam/mudam
  useEffect(() => {
    if (user) {
      perfilForm.resetForm({
        nome: user.nome || "",
        email: user.email || "",
        img: user.img || "",
      });
    }
  }, [user]);

  // Usamos useForm para os dados do perfil
  const perfilForm = useForm(
    {
      nome: user?.nome || "",
      email: user?.email || "",
      img: user?.img || "",
    },
    {
      validators: {
        nome: (v) => (!v?.trim() ? "Campo obrigatório!" : null),
        email: (v) => (!v?.trim() ? "Campo obrigatório!" : null),
      },
    },
  );

  const mutation = useMutation({
    mutationFn: (data) => API.updatePerfil(user.id, data),
    onSuccess: (response) => {
      showToast(
        response?.message || "Perfil atualizado com sucesso!",
        "success",
      );
      queryClient.invalidateQueries({ queryKey: ["perfil"] });
      setEdit(false);
    },
    onError: (err) => {
      showToast(err?.message || "Erro ao atualizar perfil.", "error");
    },
  });

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
      const playload = {
        nome: perfilForm.formValue.nome === user.nome ? null : perfilForm.formValue.nome,
        email: perfilForm.formValue.email === user.email ? null : perfilForm.formValue.email,
        img: perfilForm.formValue.img === user.img ? null : perfilForm.formValue.img,
      };
      Object.keys(playload).forEach((key) => {
        if (playload[key] === null) {
          delete playload[key];
        }
      });
      if (Object.keys(playload).length === 0) {
        showToast("Nenhum dado para atualizar", "error");
        return;
      }
      mutation.mutate(playload);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.validate()) {
      const response = await handleRequest(() =>
        API.mudarSenha({
          id: user.id,
          senhaAtual: passwordForm.formValue.current,
          novaSenha: passwordForm.formValue.new,
        }),
      );
      if (response?.ok) {
        passwordForm.resetForm();
        showToast("Senha alterada com sucesso! Por favor, faça login novamente.", "success");
        setTimeout(() => {
          logout();
        }, 1500);
      }
    }
  };

  const handleCancelEdit = async () => {
    // Se houve upload de imagem mas não salvou as alterações do perfil, deletamos a imagem órfã do servidor
    if (perfilForm.formValue.img !== user.img && perfilForm.formValue.img?.startsWith('http')) {
      try {
        await API.deleteImagem(perfilForm.formValue.img);
      } catch (err) {
        console.error("Erro ao limpar imagem órfã no cancelamento:", err);
      }
    }
    perfilForm.resetForm(); 
    setEdit(false);
  }

  const handlePasswordCancel = () => {
    passwordForm.resetForm();
    setOpenPassword(false);
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
    imageUpload,
    edit,
    setEdit,
    openPassword,
    setOpenPassword,
    handlePasswordCancel,
    handleCancelEdit,
  };
}

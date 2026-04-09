import { useForm } from "@hooks/useForm";
import API from "@app/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCadastroCategoria(onSuccess) {
  const queryClient = useQueryClient();

  const {
    formValue,
    setFormValue,
    erros,
    setErros,
    validated,
    setValidated,
    handleChange,
    validate,
  } = useForm(
    {},
    {
      validators: {
        nome: (v) => (!v?.trim() ? "Campo nome obrigatório!" : null),
        descricao: (v) => (!v?.trim() ? "Campo descrição obrigatório!" : null),
      },
    },
  );

  const mutation = useMutation({
    mutationFn: (data) => API.postCategoria(data),
    onSuccess: () => {
      // Invalida a query ["categorias"] fazendo com que todos os hooks
      // useQuery({ queryKey: ["categorias"] }) refaçam o fetch em background
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      setErros({ error: error.message, nome: "skip", descricao: "skip" });
    },
  });

  const handleSubimit = async (e) => {
    e.preventDefault();

    if (validate()) {
      mutation.mutate(formValue);
    } else {
      setValidated(true);
    }
  };

  return {
    formValue,
    setFormValue,
    erros,
    setErros,
    validated,
    setValidated,
    handleChange,
    handleSubimit,
    isLoading: mutation.isPending,
  };
}

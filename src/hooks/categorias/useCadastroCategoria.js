import { useForm } from "@hooks/useForm";
import { useRequestHandler } from "@hooks/useRequestHandler";
import API from "@app/api";

export function useCadastroCategoria(onSuccess) {
  const { isLoading, handleRequest } = useRequestHandler();

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

  const handleSubimit = async (e) => {
    e.preventDefault();

    if (validate()) {
      await handleRequest(() => API.postCategoria(formValue), {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        },
        onError: (error) => {
          setErros({ error: error.message, nome: "skip", descricao: "skip" });
        },
      });
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
    isLoading,
  };
}

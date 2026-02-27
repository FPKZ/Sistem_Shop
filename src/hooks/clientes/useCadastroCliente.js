import { useState } from "react";
import API from "@app/api";
import { useToast } from "@contexts/ToastContext";
import { useLoadRequest } from "@hooks/useLoadRequest";

export function useCadastroCliente(navigate) {
  const [formValue, setFormValue] = useState({});
  const [erros, setErros] = useState({});
  const [validated, setValidated] = useState(false);

  const { showToast } = useToast();
  const [isLoading, request] = useLoadRequest();

  function handleChange(e) {
    // eslint-disable-next-line no-unused-vars
    const { name, value, type } = e.target;
    let newValue = value;

    if (name === "telefone") {
      let digits = value.replace(/\D/g, "");
      if (digits.length > 11) digits = digits.slice(0, 11);

      if (digits.length === 0) {
        newValue = "";
      } else if (digits.length <= 2) {
        newValue = `(${digits}`;
      } else if (digits.length <= 6) {
        newValue = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      } else if (digits.length <= 10) {
        newValue = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
      } else {
        newValue = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
      }
    }

    if (name === "nome") {
      newValue = value
        .toLowerCase()
        .replace(/\b\w/g, (letra) => letra.toUpperCase());
    }

    if (name === "email") {
      newValue = value.trim();
    }

    setFormValue({
      ...formValue,
      [name]: newValue,
    });
  }

  function validate(form) {
    let newErrors = {};

    const elements = form.querySelectorAll("[name]");

    elements.forEach((e) => {
      const { name, value, required, type } = e;

      if (required && !value.trim()) {
        newErrors[name] = "Campo obrigatório!";
      }

      if (
        name === "email" &&
        value &&
        !value.includes("@") &&
        !value.includes(".")
      ) {
        newErrors[name] = "E-mail inválido";
      }

      if (type == "number" && value && isNaN(value)) {
        newErrors[name] = "Digite um valor numerico valido";
      }
    });
    return newErrors;
  }

  const handleSubimit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const newErrors = validate(form);
    setErros(newErrors);
    setValidated(true);

    if (Object.keys(newErrors).length === 0) {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      await request(async () => {
        try {
          const responsta = await API.postClientes(data);

          if (responsta.ok) {
            showToast(responsta.message, "success");
            navigate(-1);
          } else {
            if (responsta.message) {
              showToast(responsta.message || responsta.error, "error");
            }
          }
        } catch (err) {
          console.error(err);
          showToast(err, "error");
        }
      });
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

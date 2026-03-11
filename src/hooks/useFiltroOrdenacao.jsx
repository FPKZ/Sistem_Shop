import { useState, useMemo, useEffect } from "react";

export const useFiltroOrdenacao = (dadosIniciais, camposFiltragem) => {
  const [filtroInput, setFiltroInput] = useState("");
  const [filtroDebounced, setFiltroDebounced] = useState("");
  const [order, setOrder] = useState({ chave: "id", direcao: "asc" });

  useEffect(() => {
    const handler = setTimeout(() => {
      setFiltroDebounced(filtroInput);
    }, 300);

    return () => clearTimeout(handler);
  }, [filtroInput]);

  const dadosProcessados = useMemo(() => {
    let dadosFiltrados = [...dadosIniciais];

    if (filtroDebounced) {
      dadosFiltrados = dadosFiltrados.filter((item) => {
        return camposFiltragem.some((campoConfig) => {
          if (typeof campoConfig === "string") {
            const valorCampo = campoConfig
              .split(".")
              .reduce((obj, key) => obj && obj[key], item);
            return (
              valorCampo !== null &&
              valorCampo !== undefined &&
              String(valorCampo).toLowerCase().includes(filtroDebounced.toLowerCase())
            );
          }
          if (
            typeof campoConfig === "object" &&
            campoConfig.path &&
            Array.isArray(campoConfig.subCampos)
          ) {
            const valorArray = campoConfig.path
              .split(".")
              .reduce((obj, key) => obj && obj[key], item);

            if (Array.isArray(valorArray)) {
              return valorArray.some((subItem) => {
                return campoConfig.subCampos.some((subCampo) => {
                  const valorSubCampo = subCampo
                    .split(".")
                    .reduce((obj, key) => obj && obj[key], subItem);
                  return (
                    valorSubCampo !== null &&
                    valorSubCampo !== undefined &&
                    String(valorSubCampo)
                      .toLowerCase()
                      .includes(filtroDebounced.toLowerCase())
                  );
                });
              });
            }
          }
          return false;
        });
      });
    }

    dadosFiltrados.sort((a, b) => {
      const valorA = a[order.chave];
      const valorB = b[order.chave];

      if (valorA < valorB) return order.direcao === "asc" ? -1 : 1;
      if (valorA > valorB) return order.direcao === "asc" ? 1 : -1;
      return 0;
    });

    return dadosFiltrados;
  }, [dadosIniciais, filtroDebounced, order, camposFiltragem]);

  const requisitarOrdenacao = (chave) => {
    let direcao = "asc";
    if (order.chave === chave && order.direcao === "asc") {
      direcao = "desc";
    }
    setOrder({ chave, direcao });
  };

  const setOrdem = (direcao) => {
    const chave = order.chave;
    setOrder({ chave, direcao });
  };

  return {
    filtro: filtroInput,
    setFiltro: setFiltroInput,
    order,
    dadosProcessados,
    setOrdem,
    requisitarOrdenacao,
  };
};

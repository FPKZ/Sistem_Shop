import { useState, useEffect, useMemo } from "react";
import API from "@app/api";
import utils from "@app/utils";

export function useVendasDashboard() {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVendas();
  }, []);

  const getVendas = async () => {
    setLoading(true);
    const v = await API.getVendas();
    setVendas(Array.isArray(v) ? v : []);
    setLoading(false);
  };

  const stats = useMemo(() => {
    const totalVendas = vendas.length;

    const totalReceita = vendas.reduce(
      (acc, curr) => acc + (Number(curr.valor_total) || 0),
      0,
    );

    const vendasConcluidas = vendas.filter(
      (v) => v.status === "concluida",
    ).length;

    const vendasPendentes = vendas.filter(
      (v) => v.status === "pendente" || v.status === "aguardando pagamento",
    ).length;

    const devolucoes = vendas.filter(
      (v) => v.status === "devolvida" || v.status === "estorno",
    ).length;

    const pagamentosAtrasados = vendas.filter(
      (v) => v.status === "atrasado",
    ).length;

    return {
      totalVendas,
      totalReceita,
      vendasConcluidas,
      vendasPendentes,
      devolucoes,
      pagamentosAtrasados,
    };
  }, [vendas]);

  const chartData = useMemo(() => {
    const grouped = vendas.reduce((acc, curr) => {
      const date = utils.formatDate(curr.data_venda).split(" ")[0];

      if (!acc[date]) {
        acc[date] = { name: date, vendas: 0, receita: 0 };
      }
      acc[date].vendas += 1;
      acc[date].receita += Number(curr.valor_total) || 0;

      return acc;
    }, {});

    return Object.values(grouped).slice(-7);
  }, [vendas]);

  return {
    vendas,
    loading,
    stats,
    chartData,
    getVendas,
  };
}

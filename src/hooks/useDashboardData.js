import { useQuery } from "@tanstack/react-query";
import API from "@app/api";

export function useDashboardData() {
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      const response = await API.getDashboard();
      if (response && response.ok) {
        return {
          stats: response.stats,
          chartData: response.chartData,
          estoqueBaixo: response.estoqueBaixo,
          notasVencendo: response.notasVencendo,
        };
      }
      throw new Error("Erro ao buscar dados do dashboard");
    },
    refetchInterval: 10000, // Atualiza a cada 10 segundos
    staleTime: 5000,
  });

  return {
    stats: data?.stats || {
      totalVendas: 0,
      receitaTotal: 0,
      lucroTotal: 0,
      vendasConcluidas: 0,
      vendasPendentes: 0,
      pagamentosAtrasados: 0,
    },
    chartData: data?.chartData || [],
    estoqueBaixo: data?.estoqueBaixo || [],
    notasVencendo: data?.notasVencendo || [],
    loading: isLoading,
    refreshing: isRefetching,
    refresh: refetch,
  };
}

import { useState, useEffect } from "react";
import API from "@app/api";

export function useVendasDashboard() {
  const [vendas, setVendas] = useState([]);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [v, d] = await Promise.all([
        API.getVendas(),
        API.getVendasDashboard(),
      ]);
      setVendas(Array.isArray(v) ? v : []);
      if (d) {
        setStats(d.stats);
        setChartData(d.chartData);
      }
    } catch (error) {
      console.error("Erro ao carregar dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    vendas,
    loading,
    stats,
    chartData,
    getVendas: loadDashboard,
  };
}

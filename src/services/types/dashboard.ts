export interface DashboardStatsValues {
    totalUsuarios: number;
    totalClientes: number;
    produtosEmEstoque: number;
    totalVendas: number;
    totalLucro: number;
    vendasHoje: number;
}

export interface ChartDataSeries {
    name: string;
    data: number[];
}

export interface DashboardChartsData {
    lucroMensal: ChartDataSeries[];
    categorias: number[];
    labelsCategorias: string[];
    marcas: number[];
    labelsMarcas: string[];
}

export interface DashboardPayload {
    stats: DashboardStatsValues;
    charts: DashboardChartsData;
}

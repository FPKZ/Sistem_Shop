import utils from "@services/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

const StatCard = ({ title, value, subtitle, colorClass, icon }) => (
  <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all duration-300">
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
      <h3 className={`text-xl font-bold ${colorClass} mb-0`}>{value}</h3>
      {subtitle && <p className="text-[10px] text-slate-400 mt-1">{subtitle}</p>}
    </div>
    <div className={`p-2 rounded-lg bg-slate-50 group-hover:scale-110 transition-transform duration-300`}>
      <i className={`bi ${icon} text-lg text-slate-400`}></i>
    </div>
  </div>
);

export function VendasStatsSidebar({ stats, chartData }) {
  return (
    <div className="flex flex-col gap-3">
      {/* Principal Revenue Card */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
        <div className="relative z-10">
          <p className="text-slate-100/80 text-sm font-medium mb-1">Receita Total</p>
          <h2 className="text-3xl font-black text-white mb-2">
            {utils.formatMoney(stats.totalReceita)}
          </h2>
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {stats.totalVendas} VENDAS
            </span>
          </div>
        </div>
      </div>

      {/* Grid of secondary stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard 
          title="Pendentes" 
          value={stats.vendasPendentes} 
          colorClass="text-amber-500"
          icon="bi-hourglass-split"
        />
        <StatCard 
          title="Atrasados" 
          value={stats.pagamentosAtrasados} 
          colorClass="text-rose-500"
          icon="bi-exclamation-triangle"
        />
        <StatCard 
          title="Devolvidos" 
          value={stats.devolucoes} 
          colorClass="text-sky-500"
          icon="bi-arrow-return-left"
        />
        <StatCard 
          title="Concluídas" 
          value={stats.vendasConcluidas} 
          colorClass="text-emerald-500"
          icon="bi-check2-all"
        />
      </div>

      {/* Modernized Chart Container */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-sm font-bold text-slate-800">Desempenho (7 dias)</h4>
          <i className="bi bi-graph-up text-primary"></i>
        </div>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--bs-primary)" stopOpacity={1} />
                  <stop offset="100%" stopColor="var(--bs-primary)" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }}
              />
              <RechartsTooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '12px' }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                formatter={(value, name) => [
                  name === "receita" ? utils.formatMoney(value) : value,
                  name === "receita" ? "Receita" : "Vendas",
                ]}
              />
              <Bar 
                dataKey="receita" 
                fill="url(#barGradient)" 
                radius={[6, 6, 0, 0]} 
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

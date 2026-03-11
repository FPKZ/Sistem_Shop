import { Card } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ReferenceLine } from "recharts";
import utils from "@app/utils";

export function DashboardCharts({ chartData }) {
  // Formatar datas para exibir apenas Dia/Mês, pulando alguns labels se houver muitos dados
  const formattedData = chartData.map(item => ({
    ...item,
    name: new Date(item.name).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
  }));

  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Header className="bg-white pt-3 border-0">
        <h5 className="mb-0 fw-bold text-[1.3rem]!">Desempenho Mensal</h5>
      </Card.Header>
      <Card.Body className="pt-0">
        <div style={{ width: "100%", height: "100%", minHeight: 320 }}>
          <ResponsiveContainer>
            <AreaChart
              data={formattedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#198754" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#198754" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0d6efd" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDebitos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc3545" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#dc3545" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDebitosPrevistos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffc107" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ffc107" stopOpacity={0}/>
                </linearGradient>
              </defs>
                <ReferenceLine x={new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} stroke="#666" strokeDasharray="3 3" label={{ position: 'top', value: 'Hoje', fill: '#666', fontSize: 10 }} />
                <XAxis 
                  dataKey="name" 
                  stroke="#666" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  interval={6}
                />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$ ${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <Tooltip 
                  formatter={(value) => utils.formatMoney(value)}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', background: '#fff' }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={60} 
                  iconType="line" 
                  wrapperStyle={{ 
                    fontSize: '11px',
                    paddingBottom: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: '2px',
                    width: '100%',
                  }} 
                />
                <Area type="monotone" dataKey="receita" stroke="#198754" fillOpacity={1} fill="url(#colorReceita)" name="Receita" strokeWidth={2} />
                <Area type="monotone" dataKey="lucro" stroke="#0d6efd" fillOpacity={1} fill="url(#colorLucro)" name="Lucro" strokeWidth={2} />
                <Area type="monotone" dataKey="debitos" stroke="#dc3545" fillOpacity={1} fill="url(#colorDebitos)" name="Débitos (Pagos)" strokeWidth={2} />
                <Area type="monotone" dataKey="debitosPrevistos" stroke="#ffc107" fillOpacity={1} fill="url(#colorDebitosPrevistos)" name="Débitos Previstos" strokeWidth={2} />
              </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card.Body>
    </Card>
  );
}

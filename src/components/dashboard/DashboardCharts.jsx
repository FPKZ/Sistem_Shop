import { Card } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import utils from "@app/utils";

export function DashboardCharts({ chartData }) {
  // Formatar datas para exibir apenas Dia/Mês, pulando alguns labels se houver muitos dados
  const formattedData = chartData.map(item => ({
    ...item,
    name: new Date(item.name).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
  }));

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-white py-3 border-0">
        <h5 className="mb-0 fw-bold">Desempenho Mensal</h5>
      </Card.Header>
      <Card.Body>
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <AreaChart
              data={formattedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                stroke="#888" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
                interval={5}
              />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$ ${value}`} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <Tooltip 
                formatter={(value) => utils.formatMoney(value)}
                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Area type="monotone" dataKey="receita" stroke="#82ca9d" fillOpacity={1} fill="url(#colorReceita)" name="Receita" strokeWidth={3} />
              <Area type="monotone" dataKey="lucro" stroke="#8884d8" fillOpacity={1} fill="url(#colorLucro)" name="Lucro" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card.Body>
    </Card>
  );
}

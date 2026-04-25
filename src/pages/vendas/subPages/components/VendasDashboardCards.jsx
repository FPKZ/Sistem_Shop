import { useNavigate } from "react-router-dom";
import { usePermissoes } from "@hooks/auth/usePermissoes";

const ActionCard = ({ title, subtitle, icon, colorClass, onClick, disabled }) => (
  <div 
    onClick={!disabled ? onClick : undefined}
    className={`
      relative overflow-hidden group py-3 px-4 rounded-2xl transition-all duration-500
      ${disabled 
        ? 'bg-slate-100 opacity-60 cursor-not-allowed' 
        : `cursor-pointer hover:shadow-xl hover:-translate-y-1 ${colorClass}`}
    `}
  >
    {/* Background Decorative Gradient */}
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white opacity-10 group-hover:scale-150 transition-all duration-700`} />
    
    <div className="relative flex items-center justify-between">
      <div>
        <h3 className={`text-lg font-bold mb-0.5 ${disabled ? 'text-slate-500' : 'text-white'}`}>{title}</h3>
        <p className={`text-sm ${disabled ? 'text-slate-400' : 'text-white/80'}`}>{subtitle}</p>
      </div>
      <div className={`
        flex items-center justify-center w-12 h-12 rounded-xl backdrop-blur-md 
        ${disabled ? 'bg-slate-200' : 'bg-white/20'}
      `}>
        <i className={`bi ${icon} text-2xl ${disabled ? 'text-slate-400' : 'text-white'}`}></i>
      </div>
    </div>
  </div>
);

export function VendasDashboardCards() {
  const navigate = useNavigate();
  const { pode } = usePermissoes();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <ActionCard 
        title="Nova Venda"
        subtitle="Gerar novo pedido"
        icon="bi-cart-plus"
        colorClass="bg-gradient-to-br from-indigo-600 to-violet-700"
        onClick={() => navigate("Nova-Venda")}
      />
      
      <ActionCard 
        title="Estorno"
        subtitle="Cancelar transação"
        icon="bi-arrow-counterclockwise"
        colorClass="bg-gradient-to-br from-rose-500 to-pink-600"
        disabled={!pode("realizarEstorno")}
        onClick={() => navigate("estorno")}
      />
      
      <ActionCard 
        title="Devolução"
        subtitle="Registrar troca"
        icon="bi-box-seam"
        colorClass="bg-gradient-to-br from-amber-500 to-orange-500"
        disabled={!pode("realizarDevolucao")}
        onClick={() => navigate("Devolucao")}
      />
    </div>
  );
}

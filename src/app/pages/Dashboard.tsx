import React from "react";
import { Link } from "react-router";
import { DollarSign, Eye, FileText, Package, TrendingUp, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useApp } from "../context/AppContext";
import type { QuotationStatus } from "../api/types";
import { formatCurrency, formatDate } from "../utils/format";

const statusConfig: Record<QuotationStatus, { label: string; color: string; bg: string }> = {
  pendente: { label: "Pendente", color: "#D24A46", bg: "#D24A4615" },
  aprovado: { label: "Aprovado", color: "#00CC73", bg: "#00CC7315" },
  concluido: { label: "Concluido", color: "#3B82F6", bg: "#3B82F615" },
  recusado: { label: "Recusado", color: "#6B7280", bg: "#6B728015" },
};

export function Dashboard() {
  const { clients, products, quotations, dashboard } = useApp();

  const totals = dashboard?.totals ?? {
    clients: clients.length,
    products: products.length,
    quotations: quotations.length,
    totalOrcado: quotations.reduce((sum, quotation) => sum + quotation.total, 0),
    activeProducts: products.filter((product) => product.status === "ativo").length,
  };
  const recentQuotations = dashboard?.recentQuotations ?? quotations.slice(0, 5);
  const monthly = dashboard?.monthly ?? [];
  const status = dashboard?.status ?? ({} as Record<QuotationStatus, number>);

  const cards = [
    { label: "Clientes", value: totals.clients, icon: Users, color: "#D24A46", bg: "#D24A4615" },
    { label: "Produtos", value: totals.products, icon: Package, color: "#F80A0A", bg: "#F80A0A15" },
    { label: "Orcamentos", value: totals.quotations, icon: FileText, color: "#3B82F6", bg: "#3B82F615" },
    { label: "Total Orcado", value: formatCurrency(totals.totalOrcado), icon: DollarSign, color: "#00CC73", bg: "#00CC7315" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: "#000000" }}>Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>Visao geral do sistema</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-xl p-5 flex items-center gap-4" style={{ background: "#FFFDFD", border: "1px solid #F80A0A15" }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: "#6B7280" }}>{label}</p>
              <p className="text-lg font-bold" style={{ color: "#000000" }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3 rounded-xl p-5" style={{ background: "#FFFDFD", border: "1px solid #F80A0A15" }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} style={{ color: "#D24A46" }} />
            <h2 className="text-sm font-semibold" style={{ color: "#000000" }}>Volume mensal</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthly} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F80A0A10" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [formatCurrency(v), "Valor"]} />
              <Bar dataKey="valor" fill="#D24A46" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="xl:col-span-2 rounded-xl p-5" style={{ background: "#FFFDFD", border: "1px solid #F80A0A15" }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "#000000" }}>Status dos orcamentos</h2>
          <div className="space-y-3">
            {(Object.keys(statusConfig) as QuotationStatus[]).map((item) => {
              const count = status[item] ?? 0;
              const pct = totals.quotations ? (count / totals.quotations) * 100 : 0;
              const cfg = statusConfig[item];
              return (
                <div key={item}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "#6B7280" }}>{cfg.label}</span>
                    <span style={{ color: cfg.color }} className="font-medium">{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#FAF9F6" }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: cfg.color }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4" style={{ borderTop: "1px solid #F80A0A15" }}>
            <p className="text-xs font-medium mb-2" style={{ color: "#000000" }}>Produtos ativos</p>
            <p className="text-2xl font-bold" style={{ color: "#00CC73" }}>{totals.activeProducts}<span className="text-sm font-normal ml-1" style={{ color: "#6B7280" }}>/ {totals.products}</span></p>
          </div>
        </div>
      </div>

      <div className="rounded-xl mt-4 overflow-hidden" style={{ background: "#FFFDFD", border: "1px solid #F80A0A15" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #F80A0A15" }}>
          <h2 className="text-sm font-semibold" style={{ color: "#000000" }}>Orcamentos recentes</h2>
          <Link to="/orcamentos" className="text-xs font-medium hover:underline" style={{ color: "#D24A46" }}>Ver todos</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr style={{ background: "#FAF9F6" }}>{["Numero", "Cliente", "Data", "Valor total", "Status", ""].map((h) => <th key={h} className="px-5 py-3 text-left text-xs font-medium" style={{ color: "#6B7280" }}>{h}</th>)}</tr></thead>
            <tbody>
              {recentQuotations.map((quotation) => {
                const cfg = statusConfig[quotation.status];
                return (
                  <tr key={quotation.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="px-5 py-3 text-sm font-medium" style={{ color: "#F80A0A" }}>{quotation.number}</td>
                    <td className="px-5 py-3 text-sm" style={{ color: "#000000" }}>{quotation.clientName}</td>
                    <td className="px-5 py-3 text-sm" style={{ color: "#6B7280" }}>{formatDate(quotation.date)}</td>
                    <td className="px-5 py-3 text-sm font-medium">{formatCurrency(quotation.total)}</td>
                    <td className="px-5 py-3"><span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span></td>
                    <td className="px-5 py-3"><Link to={`/orcamentos/${quotation.id}`} className="flex items-center gap-1 text-xs font-medium" style={{ color: "#D24A46" }}><Eye size={13} />Ver</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

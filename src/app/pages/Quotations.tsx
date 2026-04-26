import React, { useState } from "react";
import { Link } from "react-router";
import { Eye, FileText, Filter, Pencil, Plus, Search } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { QuotationStatus } from "../api/types";
import { formatCurrency, formatDate } from "../utils/format";

const statusConfig: Record<QuotationStatus, { label: string; color: string; bg: string }> = {
  pendente: { label: "Pendente", color: "#D24A46", bg: "#D24A4615" },
  aprovado: { label: "Aprovado", color: "#00CC73", bg: "#00CC7315" },
  concluido: { label: "Concluido", color: "#3B82F6", bg: "#3B82F615" },
  recusado: { label: "Recusado", color: "#6B7280", bg: "#6B728015" },
};

export function Quotations() {
  const { quotations } = useApp();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<QuotationStatus | "todos">("todos");
  const [filterDate, setFilterDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = quotations.filter((quotation) => {
    const matchSearch = quotation.clientName.toLowerCase().includes(search.toLowerCase()) || quotation.number.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "todos" || quotation.status === filterStatus;
    const matchDate = !filterDate || quotation.date === filterDate;
    return matchSearch && matchStatus && matchDate;
  });

  const totalFiltered = filtered.reduce((acc, quotation) => acc + quotation.total, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex-1">
          <h1 className="text-xl font-bold" style={{ color: "#000000" }}>Orcamentos</h1>
          <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>{quotations.length} orcamento{quotations.length !== 1 ? "s" : ""} registrado{quotations.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border" style={{ color: showFilters ? "#D24A46" : "#6B7280", borderColor: showFilters ? "#D24A46" : "#6B728030", background: showFilters ? "#D24A4610" : "transparent" }}>
          <Filter size={15} />Filtros
        </button>
        <Link to="/orcamentos/novo" className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white" style={{ background: "#D24A46" }}>
          <Plus size={16} />Novo orcamento
        </Link>
      </div>

      {showFilters ? (
        <div className="rounded-xl p-4 mb-4 flex flex-col sm:flex-row gap-3" style={{ background: "#FFFDFD", border: "1px solid #F80A0A15" }}>
          <div className="flex-1">
            <label className="block text-xs font-medium mb-1" style={{ color: "#6B7280" }}>Cliente ou numero</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "#FAF9F6", border: "1px solid #6B728030" }}>
              <Search size={14} style={{ color: "#6B7280" }} />
              <input type="text" placeholder="Buscar..." value={search} onChange={(event) => setSearch(event.target.value)} className="flex-1 text-sm bg-transparent outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#6B7280" }}>Data</label>
            <input type="date" value={filterDate} onChange={(event) => setFilterDate(event.target.value)} className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "#FAF9F6", border: "1px solid #6B728030" }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#6B7280" }}>Status</label>
            <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value as QuotationStatus | "todos")} className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "#FAF9F6", border: "1px solid #6B728030" }}>
              <option value="todos">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="aprovado">Aprovado</option>
              <option value="concluido">Concluido</option>
              <option value="recusado">Recusado</option>
            </select>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg mb-4" style={{ background: "#FFFDFD", border: "1px solid #6B728030" }}>
          <Search size={16} style={{ color: "#6B7280" }} />
          <input type="text" placeholder="Buscar por cliente ou numero..." value={search} onChange={(event) => setSearch(event.target.value)} className="flex-1 text-sm bg-transparent outline-none" />
        </div>
      )}

      {filtered.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg mb-4" style={{ background: "#F80A0A10", border: "1px solid #F80A0A20" }}>
          <span className="text-xs" style={{ color: "#6B7280" }}>{filtered.length} encontrado{filtered.length !== 1 ? "s" : ""}</span>
          <span className="text-sm font-semibold" style={{ color: "#F80A0A" }}>Total: {formatCurrency(totalFiltered)}</span>
        </div>
      )}

      <div className="rounded-xl overflow-hidden" style={{ background: "#FFFDFD", border: "1px solid #F80A0A15" }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: "#F80A0A10" }}>
              <FileText size={24} style={{ color: "#D24A46" }} />
            </div>
            <p className="text-sm font-medium" style={{ color: "#000000" }}>Nenhum orcamento encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr style={{ background: "#FAF9F6" }}>{["Numero", "Cliente", "Data", "Valor total", "Status", "Acoes"].map((header) => <th key={header} className="px-5 py-3 text-left text-xs font-medium" style={{ color: "#6B7280" }}>{header}</th>)}</tr></thead>
              <tbody>
                {filtered.map((quotation) => {
                  const cfg = statusConfig[quotation.status];
                  return (
                    <tr key={quotation.id} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="px-5 py-3 text-sm font-semibold" style={{ color: "#F80A0A" }}>{quotation.number}</td>
                      <td className="px-5 py-3 text-sm" style={{ color: "#000000" }}>{quotation.clientName}</td>
                      <td className="px-5 py-3 text-sm" style={{ color: "#6B7280" }}>{formatDate(quotation.date)}</td>
                      <td className="px-5 py-3 text-sm font-medium">{formatCurrency(quotation.total)}</td>
                      <td className="px-5 py-3"><span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span></td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Link to={`/orcamentos/${quotation.id}`} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: "#D24A46", background: "#D24A4615" }}><Eye size={13} />Ver</Link>
                          <Link to={`/orcamentos/${quotation.id}/editar`} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: "#3B82F6", background: "#3B82F615" }}><Pencil size={13} />Editar</Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

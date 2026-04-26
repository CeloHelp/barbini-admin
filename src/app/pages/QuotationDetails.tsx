import React from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, FileText, Pencil, User } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { QuotationStatus } from "../api/types";
import { formatCurrency, formatDate } from "../utils/format";

const statusConfig: Record<QuotationStatus, { label: string; color: string; bg: string }> = {
  pendente: { label: "Pendente", color: "#D24A46", bg: "#D24A4618" },
  aprovado: { label: "Aprovado", color: "#00CC73", bg: "#00CC7318" },
  concluido: { label: "Concluido", color: "#3B82F6", bg: "#3B82F618" },
  recusado: { label: "Recusado", color: "#6B7280", bg: "#6B728018" },
};

export function QuotationDetails() {
  const { id } = useParams();
  const { getQuotation } = useApp();
  const quotation = id ? getQuotation(id) : undefined;

  if (!quotation) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <FileText size={28} style={{ color: "#D24A46" }} />
        <p className="text-base font-semibold mt-4" style={{ color: "#000000" }}>Orcamento nao encontrado</p>
        <Link to="/orcamentos" className="mt-4 text-sm font-medium hover:underline" style={{ color: "#D24A46" }}>Voltar</Link>
      </div>
    );
  }

  const cfg = statusConfig[quotation.status];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/orcamentos" className="p-2 rounded-lg" style={{ background: "#F80A0A10", color: "#F80A0A" }}><ArrowLeft size={16} /></Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold" style={{ color: "#000000" }}>Detalhes do orcamento</h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
          </div>
          <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>{quotation.number}</p>
        </div>
        <Link to={`/orcamentos/${quotation.id}/editar`} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white" style={{ background: "#D24A46" }}><Pencil size={15} />Editar</Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <div className="rounded-xl p-5" style={{ background: "#FFFDFD", border: "1px solid #F80A0A15" }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: "#000000" }}>Informacoes gerais</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div><p className="text-xs" style={{ color: "#6B7280" }}>Numero</p><p className="text-sm font-semibold mt-0.5" style={{ color: "#F80A0A" }}>{quotation.number}</p></div>
              <div><p className="text-xs" style={{ color: "#6B7280" }}>Data</p><p className="text-sm font-medium mt-0.5">{formatDate(quotation.date)}</p></div>
              <div><p className="text-xs" style={{ color: "#6B7280" }}>Status</p><span className="inline-flex mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span></div>
            </div>
            {quotation.notes && <p className="text-sm mt-4 pt-3" style={{ color: "#000000", borderTop: "1px solid #F80A0A10" }}>{quotation.notes}</p>}
          </div>

          <div className="rounded-xl overflow-hidden" style={{ background: "#FFFDFD", border: "1px solid #F80A0A15" }}>
            <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: "1px solid #F80A0A15" }}>
              <FileText size={15} style={{ color: "#D24A46" }} />
              <h2 className="text-sm font-semibold" style={{ color: "#000000" }}>Itens</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr style={{ background: "#FAF9F6" }}>{["Produto", "Qtd", "Preco unitario", "Subtotal"].map((header) => <th key={header} className="px-5 py-3 text-left text-xs font-medium" style={{ color: "#6B7280" }}>{header}</th>)}</tr></thead>
                <tbody>
                  {quotation.items.map((item, index) => (
                    <tr key={`${item.productId}-${index}`} style={{ borderTop: index > 0 ? "1px solid #F80A0A10" : undefined }}>
                      <td className="px-5 py-3 text-sm font-medium">{item.productName}</td>
                      <td className="px-5 py-3 text-sm" style={{ color: "#6B7280" }}>{item.quantity}</td>
                      <td className="px-5 py-3 text-sm" style={{ color: "#6B7280" }}>{formatCurrency(item.unitPrice)}</td>
                      <td className="px-5 py-3 text-sm font-semibold">{formatCurrency(item.quantity * item.unitPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl p-5" style={{ background: "#FFFDFD", border: "1px solid #F80A0A15" }}>
            <div className="flex items-center gap-2 mb-4"><User size={15} style={{ color: "#D24A46" }} /><h2 className="text-sm font-semibold">Cliente</h2></div>
            <p className="text-sm font-medium">{quotation.clientName}</p>
            {quotation.client?.phone && <p className="text-sm mt-2" style={{ color: "#6B7280" }}>{quotation.client.phone}</p>}
            {quotation.client?.email && <p className="text-sm mt-1" style={{ color: "#6B7280" }}>{quotation.client.email}</p>}
          </div>
          <div className="rounded-xl p-5" style={{ background: "#FFFDFD", border: "1px solid #F80A0A15" }}>
            <h2 className="text-sm font-semibold mb-4">Resumo financeiro</h2>
            <div className="flex justify-between text-sm"><span style={{ color: "#6B7280" }}>Subtotal</span><span>{formatCurrency(quotation.subtotal)}</span></div>
            <div className="flex justify-between text-sm mt-2"><span style={{ color: "#6B7280" }}>Desconto</span><span style={{ color: "#F80A0A" }}>{quotation.discount ? `- ${formatCurrency(quotation.discount)}` : "-"}</span></div>
            <div className="flex justify-between pt-3 mt-3" style={{ borderTop: "2px solid #F80A0A" }}><span className="font-bold">Total</span><span className="font-bold" style={{ color: "#F80A0A" }}>{formatCurrency(quotation.total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

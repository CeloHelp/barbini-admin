import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Plus, Save, Trash2, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { QuotationPayload, QuotationStatus } from "../api/types";
import { calcTotal, formatCurrency } from "../utils/format";

interface ItemForm {
  productId: string;
  quantity: number;
  unitPrice: number;
}

const emptyItem: ItemForm = { productId: "", quantity: 1, unitPrice: 0 };

export function QuotationForm({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients, products, getQuotation, addQuotation, updateQuotation } = useApp();
  const quotation = id ? getQuotation(id) : undefined;
  const [clientId, setClientId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<QuotationStatus>("pendente");
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<ItemForm[]>([{ ...emptyItem }]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode === "edit" && quotation) {
      setClientId(quotation.clientId);
      setDate(quotation.date);
      setStatus(quotation.status);
      setDiscount(quotation.discount);
      setNotes(quotation.notes);
      setItems(quotation.items.map((item) => ({ productId: item.productId, quantity: item.quantity, unitPrice: item.unitPrice })));
    }
  }, [mode, quotation]);

  const total = useMemo(() => calcTotal(items, discount), [discount, items]);

  function updateItem(index: number, patch: Partial<ItemForm>) {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  function handleProductChange(index: number, productId: string) {
    const product = products.find((item) => item.id === productId);
    updateItem(index, { productId, unitPrice: product?.price ?? 0 });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    const cleanItems = items.filter((item) => item.productId && item.quantity > 0);
    if (!clientId) return setError("Selecione um cliente.");
    if (!cleanItems.length) return setError("Inclua ao menos um item.");

    const payload: QuotationPayload = { clientId, date, status, discount, notes, items: cleanItems };
    setSaving(true);
    try {
      const saved = mode === "create" ? await addQuotation(payload) : await updateQuotation(id!, payload);
      navigate(`/orcamentos/${saved.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar orcamento.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/orcamentos" className="p-2 rounded-lg" style={{ background: "#F80A0A10", color: "#F80A0A" }}><ArrowLeft size={16} /></Link>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#000000" }}>{mode === "create" ? "Novo orcamento" : "Editar orcamento"}</h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>Monte os itens e confira o total antes de salvar</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl p-5 grid grid-cols-1 md:grid-cols-4 gap-4" style={{ background: "#FFFDFD", border: "1px solid #F80A0A15" }}>
          <label className="md:col-span-2 text-sm font-medium">
            Cliente
            <select value={clientId} onChange={(event) => setClientId(event.target.value)} className="mt-1 w-full px-3.5 py-2.5 rounded-lg text-sm outline-none" style={{ background: "#FAF9F6", border: "1px solid #6B728040" }}>
              <option value="">Selecione</option>
              {clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium">
            Data
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-1 w-full px-3.5 py-2.5 rounded-lg text-sm outline-none" style={{ background: "#FAF9F6", border: "1px solid #6B728040" }} />
          </label>
          <label className="text-sm font-medium">
            Status
            <select value={status} onChange={(event) => setStatus(event.target.value as QuotationStatus)} className="mt-1 w-full px-3.5 py-2.5 rounded-lg text-sm outline-none" style={{ background: "#FAF9F6", border: "1px solid #6B728040" }}>
              <option value="pendente">Pendente</option>
              <option value="aprovado">Aprovado</option>
              <option value="concluido">Concluido</option>
              <option value="recusado">Recusado</option>
            </select>
          </label>
          <label className="md:col-span-4 text-sm font-medium">
            Observacoes
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={2} className="mt-1 w-full px-3.5 py-2.5 rounded-lg text-sm outline-none resize-none" style={{ background: "#FAF9F6", border: "1px solid #6B728040" }} />
          </label>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ background: "#FFFDFD", border: "1px solid #F80A0A15" }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #F80A0A15" }}>
            <h2 className="text-sm font-semibold">Itens do orcamento</h2>
            <button type="button" onClick={() => setItems((current) => [...current, { ...emptyItem }])} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white" style={{ background: "#D24A46" }}><Plus size={14} />Adicionar item</button>
          </div>
          <div className="p-5 space-y-3">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                <label className="md:col-span-5 text-xs font-medium" style={{ color: "#6B7280" }}>
                  Produto
                  <select value={item.productId} onChange={(event) => handleProductChange(index, event.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "#FAF9F6", border: "1px solid #6B728040" }}>
                    <option value="">Selecione</option>
                    {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                  </select>
                </label>
                <label className="md:col-span-2 text-xs font-medium" style={{ color: "#6B7280" }}>
                  Quantidade
                  <input type="number" min="0.01" step="0.01" value={item.quantity} onChange={(event) => updateItem(index, { quantity: Number(event.target.value) })} className="mt-1 w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "#FAF9F6", border: "1px solid #6B728040" }} />
                </label>
                <label className="md:col-span-2 text-xs font-medium" style={{ color: "#6B7280" }}>
                  Preco
                  <input type="number" min="0" step="0.01" value={item.unitPrice} onChange={(event) => updateItem(index, { unitPrice: Number(event.target.value) })} className="mt-1 w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "#FAF9F6", border: "1px solid #6B728040" }} />
                </label>
                <div className="md:col-span-2 text-sm font-semibold">{formatCurrency(item.quantity * item.unitPrice)}</div>
                <button type="button" onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="md:col-span-1 p-2 rounded-lg" style={{ color: "#F80A0A", background: "#F80A0A15" }}><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between" style={{ background: "#FFFDFD", border: "1px solid #F80A0A15" }}>
          <label className="text-sm font-medium">
            Desconto
            <input type="number" min="0" step="0.01" value={discount} onChange={(event) => setDiscount(Number(event.target.value))} className="ml-0 md:ml-3 mt-1 md:mt-0 px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "#FAF9F6", border: "1px solid #6B728040" }} />
          </label>
          <div className="text-lg font-bold" style={{ color: "#F80A0A" }}>Total: {formatCurrency(total)}</div>
        </div>

        {error && <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "#F80A0A15", color: "#F80A0A" }}>{error}</div>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-70" style={{ background: "#D24A46" }}><Save size={15} />{saving ? "Salvando..." : "Salvar"}</button>
          <Link to="/orcamentos" className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border" style={{ color: "#6B7280", borderColor: "#6B728040" }}><X size={15} />Cancelar</Link>
        </div>
      </form>
    </div>
  );
}

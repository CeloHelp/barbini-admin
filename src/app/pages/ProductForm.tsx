import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { ArrowLeft, ChevronDown, ChevronUp, Save, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { Product } from "../api/types";

type FormData = Omit<Product, "id">;

const empty: FormData = {
  name: "",
  description: "",
  price: 0,
  unit: "",
  status: "ativo",
};

function formatMoneyInput(value: number): string {
  if (!value) return "";
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseMoneyInput(value: string): number {
  const clean = value.replace(/[^\d,.]/g, "");
  if (!clean) return 0;

  const hasDecimalSeparator = /[,.]/.test(clean);
  if (hasDecimalSeparator) {
    const normalized = clean.replace(/\./g, "").replace(",", ".");
    return Number.parseFloat(normalized) || 0;
  }

  if (clean.length <= 2) return Number(clean);
  return Number(clean) / 100;
}

function sanitizeMoneyInput(value: string): string {
  return value.replace(/[^\d,.]/g, "");
}

function inputStyle(focused: boolean) {
  return {
    background: "#FAF9F6",
    border: `1px solid ${focused ? "#F80A0A" : "#6B728040"}`,
    color: "#000000",
    transition: "border-color 0.15s",
  };
}

export function ProductForm({ mode }: { mode: "create" | "edit" | "view" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, addProduct, updateProduct } = useApp();
  const [form, setForm] = useState<FormData>(empty);
  const [priceInput, setPriceInput] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      const product = getProduct(id);
      if (product) {
        setForm({
          name: product.name,
          description: product.description,
          price: product.price,
          unit: product.unit,
          status: product.status,
        });
        setPriceInput(formatMoneyInput(product.price));
      } else {
        navigate("/produtos");
      }
    }
  }, [id, mode]);

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) e.name = "Nome é obrigatório";
    const price = parseMoneyInput(priceInput);
    if (!price || price <= 0) e.price = "Preço deve ser maior que zero";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const syncPrice = (value: string) => {
    const price = parseMoneyInput(value);
    setForm((current) => ({ ...current, price }));
    setPriceInput(formatMoneyInput(price));
    return price;
  };

  const handlePriceChange = (value: string) => {
    const sanitized = sanitizeMoneyInput(value);
    setPriceInput(sanitized);
    setForm((current) => ({ ...current, price: parseMoneyInput(sanitized) }));
  };

  const stepPrice = (delta: number) => {
    const next = Math.max(0, Number((form.price + delta).toFixed(2)));
    setForm({ ...form, price: next });
    setPriceInput(formatMoneyInput(next));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = syncPrice(priceInput);
    if (!validate()) return;
    const payload = { ...form, price };
    if (mode === "create") {
      await addProduct(payload);
    } else if (mode === "edit" && id) {
      await updateProduct(id, payload);
    }
    setSaved(true);
    setTimeout(() => navigate("/produtos"), 800);
  };

  const isView = mode === "view";
  const title =
    mode === "create" ? "Novo produto" : mode === "edit" ? "Editar produto" : "Detalhes do produto";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/produtos"
          className="p-2 rounded-lg transition-colors hover:opacity-70"
          style={{ background: "#F80A0A10", color: "#F80A0A" }}
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#000000" }}>
            {title}
          </h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            {mode === "create"
              ? "Preencha os dados do novo produto"
              : mode === "edit"
              ? "Atualize as informações do produto"
              : "Informações do produto"}
          </p>
        </div>
      </div>

      {/* Form card */}
      <div
        className="rounded-xl p-6 max-w-xl"
        style={{ background: "#FFFDFD", border: "1px solid #F80A0A15" }}
      >
        {saved && (
          <div
            className="mb-4 px-4 py-3 rounded-lg text-sm font-medium"
            style={{ background: "#00CC7318", color: "#00CC73", border: "1px solid #00CC7330" }}
          >
            ✓ Produto salvo com sucesso!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#000000" }}>
              Nome do produto *
            </label>
            <input
              type="text"
              value={form.name}
              readOnly={isView}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nome do produto"
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
              style={inputStyle(focused === "name")}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused(null)}
            />
            {errors.name && <p className="text-xs mt-1" style={{ color: "#F80A0A" }}>{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#000000" }}>
              Descrição
            </label>
            <textarea
              value={form.description}
              readOnly={isView}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Descrição do produto ou serviço..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none resize-none"
              style={inputStyle(focused === "description")}
              onFocus={() => setFocused("description")}
              onBlur={() => setFocused(null)}
            />
          </div>

          {/* Price + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#000000" }}>
                Preço *
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={priceInput}
                readOnly={isView}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="0,00"
                className="w-full px-3.5 py-2.5 pr-11 rounded-lg text-sm outline-none"
                style={inputStyle(focused === "price")}
                onFocus={() => setFocused("price")}
                onBlur={() => {
                  syncPrice(priceInput);
                  setFocused(null);
                }}
              />
              {!isView && (
                <div className="absolute right-1.5 top-[31px] flex flex-col">
                  <button
                    type="button"
                    onClick={() => stepPrice(0.01)}
                    className="h-5 w-7 flex items-center justify-center rounded-t"
                    style={{ color: "#6B7280", background: "#6B728015" }}
                    title="Aumentar centavos"
                  >
                    <ChevronUp size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => stepPrice(-0.01)}
                    className="h-5 w-7 flex items-center justify-center rounded-b"
                    style={{ color: "#6B7280", background: "#6B728015" }}
                    title="Diminuir centavos"
                  >
                    <ChevronDown size={13} />
                  </button>
                </div>
              )}
              {errors.price && <p className="text-xs mt-1" style={{ color: "#F80A0A" }}>{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#000000" }}>
                Unidade
              </label>
              <input
                type="text"
                value={form.unit}
                readOnly={isView}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                placeholder="m², un, ponto..."
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
                style={inputStyle(focused === "unit")}
                onFocus={() => setFocused("unit")}
                onBlur={() => setFocused(null)}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#000000" }}>
              Status
            </label>
            <div className="flex gap-2">
              {(["ativo", "inativo"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={isView}
                  onClick={() => !isView && setForm({ ...form, status: s })}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all border"
                  style={
                    form.status === s
                      ? s === "ativo"
                        ? { background: "#00CC73", color: "#E0FFDE", borderColor: "#00CC73" }
                        : { background: "#6B7280", color: "#fff", borderColor: "#6B7280" }
                      : { background: "transparent", color: "#6B7280", borderColor: "#6B728030" }
                  }
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          {!isView && (
            <div className="flex gap-3 pt-2" style={{ borderTop: "1px solid #F80A0A15" }}>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ background: "#D24A46" }}
              >
                <Save size={15} />
                {mode === "create" ? "Salvar" : "Salvar alterações"}
              </button>
              <Link
                to="/produtos"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border transition-opacity hover:opacity-70"
                style={{ color: "#6B7280", borderColor: "#6B728040" }}
              >
                <X size={15} />
                Cancelar
              </Link>
            </div>
          )}

          {isView && (
            <div className="flex gap-3 pt-2" style={{ borderTop: "1px solid #F80A0A15" }}>
              <Link
                to={`/produtos/${id}/editar`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ background: "#D24A46" }}
              >
                Editar produto
              </Link>
              <Link
                to="/produtos"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border transition-opacity hover:opacity-70"
                style={{ color: "#6B7280", borderColor: "#6B728040" }}
              >
                <ArrowLeft size={15} />
                Voltar
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

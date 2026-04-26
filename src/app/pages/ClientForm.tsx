import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { ArrowLeft, Save, X } from "lucide-react";
import { useApp } from "../context/AppContext";

interface FormData {
  name: string;
  phone: string;
  email: string;
  notes: string;
}

const empty: FormData = { name: "", phone: "", email: "", notes: "" };

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 11);
}

function formatPhone(value: string): string {
  const digits = onlyDigits(value);
  if (digits.length <= 2) return digits ? `(${digits}` : "";

  const areaCode = digits.slice(0, 2);
  const number = digits.slice(2);

  if (number.length <= 4) return `(${areaCode}) ${number}`;

  if (digits.length <= 10) {
    return `(${areaCode}) ${number.slice(0, 4)}-${number.slice(4)}`;
  }

  return `(${areaCode}) ${number.slice(0, 5)}-${number.slice(5)}`;
}

function isValidPhone(value: string): boolean {
  const digits = onlyDigits(value);
  return digits.length === 10 || digits.length === 11;
}

function inputStyle(focused: boolean) {
  return {
    background: "#FAF9F6",
    border: `1px solid ${focused ? "#F80A0A" : "#6B728040"}`,
    color: "#000000",
    transition: "border-color 0.15s",
  };
}

export function ClientForm({ mode }: { mode: "create" | "edit" | "view" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getClient, addClient, updateClient } = useApp();
  const [form, setForm] = useState<FormData>(empty);
  const [focused, setFocused] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      const client = getClient(id);
      if (client) {
        setForm({ name: client.name, phone: client.phone, email: client.email, notes: client.notes });
      } else {
        navigate("/clientes");
      }
    }
  }, [id, mode]);

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = "Nome é obrigatório";
    if (!form.phone.trim()) e.phone = "Telefone é obrigatório";
    else if (!isValidPhone(form.phone)) e.phone = "Informe DDD + telefone com 10 ou 11 dígitos";
    if (!form.email.trim()) e.email = "E-mail é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "E-mail inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePhoneChange = (value: string) => {
    setForm({ ...form, phone: formatPhone(value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (mode === "create") {
      await addClient(form);
    } else if (mode === "edit" && id) {
      await updateClient(id, form);
    }
    setSaved(true);
    setTimeout(() => navigate("/clientes"), 800);
  };

  const isView = mode === "view";
  const title = mode === "create" ? "Novo cliente" : mode === "edit" ? "Editar cliente" : "Detalhes do cliente";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/clientes"
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
              ? "Preencha os dados do novo cliente"
              : mode === "edit"
              ? "Atualize as informações do cliente"
              : "Informações do cliente"}
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
            ✓ Cliente salvo com sucesso!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#000000" }}>
              Nome completo *
            </label>
            <input
              type="text"
              value={form.name}
              readOnly={isView}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nome do cliente"
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
              style={inputStyle(focused === "name")}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused(null)}
            />
            {errors.name && (
              <p className="text-xs mt-1" style={{ color: "#F80A0A" }}>{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#000000" }}>
              Telefone *
            </label>
            <input
              type="text"
              value={form.phone}
              readOnly={isView}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="(00) 00000-0000"
              inputMode="numeric"
              maxLength={15}
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
              style={inputStyle(focused === "phone")}
              onFocus={() => setFocused("phone")}
              onBlur={() => setFocused(null)}
            />
            {errors.phone && (
              <p className="text-xs mt-1" style={{ color: "#F80A0A" }}>{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#000000" }}>
              E-mail *
            </label>
            <input
              type="email"
              value={form.email}
              readOnly={isView}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="cliente@email.com"
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
              style={inputStyle(focused === "email")}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
            />
            {errors.email && (
              <p className="text-xs mt-1" style={{ color: "#F80A0A" }}>{errors.email}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#000000" }}>
              Observações
            </label>
            <textarea
              value={form.notes}
              readOnly={isView}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Informações adicionais sobre o cliente..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none resize-none"
              style={inputStyle(focused === "notes")}
              onFocus={() => setFocused("notes")}
              onBlur={() => setFocused(null)}
            />
          </div>

          {/* Actions */}
          {!isView && (
            <div
              className="flex gap-3 pt-2"
              style={{ borderTop: "1px solid #F80A0A15" }}
            >
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ background: "#D24A46" }}
              >
                <Save size={15} />
                {mode === "create" ? "Salvar" : "Salvar alterações"}
              </button>
              <Link
                to="/clientes"
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
                to={`/clientes/${id}/editar`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ background: "#D24A46" }}
              >
                Editar cliente
              </Link>
              <Link
                to="/clientes"
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

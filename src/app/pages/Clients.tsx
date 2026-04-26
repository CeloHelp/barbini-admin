import React, { useState } from "react";
import { Link } from "react-router";
import { Plus, Search, Eye, Pencil, Trash2, Users } from "lucide-react";
import { useApp } from "../context/AppContext";
import { DeleteModal } from "../components/DeleteModal";
import { formatDate } from "../utils/format";

export function Clients() {
  const { clients, deleteClient } = useApp();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const handleDelete = async () => {
    if (deleteId) {
      await deleteClient(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex-1">
          <h1 className="text-xl font-bold" style={{ color: "#000000" }}>
            Clientes
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
            {clients.length} cliente{clients.length !== 1 ? "s" : ""} cadastrado{clients.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to="/clientes/novo"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: "#D24A46" }}
        >
          <Plus size={16} />
          Novo cliente
        </Link>
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg mb-4"
        style={{
          background: "#FFFDFD",
          border: "1px solid #6B728030",
        }}
      >
        <Search size={16} style={{ color: "#6B7280" }} />
        <input
          type="text"
          placeholder="Buscar por nome, e-mail ou telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm bg-transparent outline-none"
          style={{ color: "#000000" }}
        />
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "#FFFDFD", border: "1px solid #F80A0A15" }}
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
              style={{ background: "#F80A0A10" }}
            >
              <Users size={24} style={{ color: "#D24A46" }} />
            </div>
            <p className="text-sm font-medium" style={{ color: "#000000" }}>
              {search ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
            </p>
            <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
              {search ? "Tente outros termos de busca" : "Clique em 'Novo cliente' para começar"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "#FAF9F6" }}>
                  {["Nome", "Telefone", "E-mail", "Cadastro", "Ações"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-medium"
                      style={{ color: "#6B7280" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((client, idx) => (
                  <tr
                    key={client.id}
                    className="hover:bg-[#FAF9F6] transition-colors"
                    style={{
                      borderTop: idx > 0 ? "1px solid #F80A0A10" : undefined,
                    }}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background: "#D24A46" }}
                        >
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium" style={{ color: "#000000" }}>
                          {client.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: "#6B7280" }}>
                      {client.phone}
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: "#6B7280" }}>
                      {client.email}
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: "#6B7280" }}>
                      {formatDate(client.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/clientes/${client.id}`}
                          className="p-1.5 rounded-lg transition-colors hover:opacity-70"
                          title="Visualizar"
                          style={{ color: "#3B82F6", background: "#3B82F615" }}
                        >
                          <Eye size={14} />
                        </Link>
                        <Link
                          to={`/clientes/${client.id}/editar`}
                          className="p-1.5 rounded-lg transition-colors hover:opacity-70"
                          title="Editar"
                          style={{ color: "#D24A46", background: "#D24A4615" }}
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => setDeleteId(client.id)}
                          className="p-1.5 rounded-lg transition-colors hover:opacity-70"
                          title="Excluir"
                          style={{ color: "#F80A0A", background: "#F80A0A15" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={!!deleteId}
        message="Deseja realmente excluir este cliente? Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

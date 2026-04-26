import React, { useState } from "react";
import { Link } from "react-router";
import { Plus, Search, Eye, Pencil, Trash2, Package } from "lucide-react";
import { useApp } from "../context/AppContext";
import { DeleteModal } from "../components/DeleteModal";
import { formatCurrency } from "../utils/format";

export function Products() {
  const { products, deleteProduct } = useApp();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"todos" | "ativo" | "inativo">("todos");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "todos" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleDelete = async () => {
    if (deleteId) {
      await deleteProduct(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex-1">
          <h1 className="text-xl font-bold" style={{ color: "#000000" }}>
            Produtos
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
            {products.length} produto{products.length !== 1 ? "s" : ""} cadastrado{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to="/produtos/novo"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: "#D24A46" }}
        >
          <Plus size={16} />
          Novo produto
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div
          className="flex items-center gap-2 flex-1 px-3.5 py-2.5 rounded-lg"
          style={{ background: "#FFFDFD", border: "1px solid #6B728030" }}
        >
          <Search size={16} style={{ color: "#6B7280" }} />
          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none"
            style={{ color: "#000000" }}
          />
        </div>
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: "#FFFDFD", border: "1px solid #6B728030" }}>
          {(["todos", "ativo", "inativo"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all"
              style={
                filterStatus === s
                  ? { background: "#D24A46", color: "#fff" }
                  : { color: "#6B7280", background: "transparent" }
              }
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
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
              <Package size={24} style={{ color: "#D24A46" }} />
            </div>
            <p className="text-sm font-medium" style={{ color: "#000000" }}>
              Nenhum produto encontrado
            </p>
            <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
              Ajuste os filtros ou clique em 'Novo produto'
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "#FAF9F6" }}>
                  {["Produto", "Descrição", "Preço", "Unidade", "Status", "Ações"].map((h) => (
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
                {filtered.map((product, idx) => (
                  <tr
                    key={product.id}
                    className="hover:bg-[#FAF9F6] transition-colors"
                    style={{
                      borderTop: idx > 0 ? "1px solid #F80A0A10" : undefined,
                    }}
                  >
                    <td className="px-5 py-3">
                      <span className="text-sm font-medium" style={{ color: "#000000" }}>
                        {product.name}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm max-w-[200px]" style={{ color: "#6B7280" }}>
                      <span className="line-clamp-1">{product.description}</span>
                    </td>
                    <td className="px-5 py-3 text-sm font-medium" style={{ color: "#F80A0A" }}>
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: "#6B7280" }}>
                      {product.unit || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium"
                        style={
                          product.status === "ativo"
                            ? { background: "#00CC7318", color: "#00CC73" }
                            : { background: "#6B728018", color: "#6B7280" }
                        }
                      >
                        {product.status === "ativo" ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/produtos/${product.id}`}
                          className="p-1.5 rounded-lg transition-colors hover:opacity-70"
                          title="Visualizar"
                          style={{ color: "#3B82F6", background: "#3B82F615" }}
                        >
                          <Eye size={14} />
                        </Link>
                        <Link
                          to={`/produtos/${product.id}/editar`}
                          className="p-1.5 rounded-lg transition-colors hover:opacity-70"
                          title="Editar"
                          style={{ color: "#D24A46", background: "#D24A4615" }}
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => setDeleteId(product.id)}
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
        message="Deseja realmente excluir este produto? Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

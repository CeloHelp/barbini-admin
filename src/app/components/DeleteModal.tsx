import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({
  isOpen,
  title = "Confirmar exclusão",
  message = "Deseja realmente excluir este item? Esta ação não pode ser desfeita.",
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm rounded-xl shadow-xl p-6"
        style={{ background: "#FFFDFD" }}
      >
        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded-lg transition-colors hover:opacity-70"
          style={{ color: "#6B7280" }}
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
          style={{ background: "#F80A0A18" }}
        >
          <AlertTriangle size={24} style={{ color: "#F80A0A" }} />
        </div>

        {/* Content */}
        <h2 className="text-base font-semibold mb-2" style={{ color: "#000000" }}>
          {title}
        </h2>
        <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:opacity-80"
            style={{
              color: "#6B7280",
              borderColor: "#6B728040",
              background: "transparent",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
            style={{ background: "#F80A0A" }}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

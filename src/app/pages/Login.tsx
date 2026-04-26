import React, { useState } from "react";
import { Navigate } from "react-router";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useApp } from "../context/AppContext";

export function Login() {
  const { login, isAuthenticated } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const success = await login(email, password);
    setLoading(false);
    if (!success) {
      setError("E-mail ou senha inválidos. Use admin@barbini.com / admin123");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#FAF9F6" }}
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <div
          className="rounded-2xl shadow-lg p-8"
          style={{ background: "#FFFDFD", border: "1px solid #F80A0A20" }}
        >
          {/* Logo area */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-md"
              style={{ background: "#F80A0A" }}
            >
              <span className="text-white text-2xl font-black">B</span>
            </div>
            <h1
              className="text-lg font-black tracking-widest"
              style={{ color: "#F80A0A" }}
            >
              BARBINI ADMIN
            </h1>
            <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
              Painel Administrativo
            </p>
          </div>

          {/* Divider */}
          <div
            className="h-px mb-6"
            style={{ background: "#F80A0A30" }}
          />

          <h2 className="text-base font-semibold mb-1" style={{ color: "#000000" }}>
            Entrar no painel
          </h2>
          <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
            Acesse sua conta para continuar
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "#000000" }}
              >
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{
                  background: "#FAF9F6",
                  border: "1px solid #6B728040",
                  color: "#000000",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#F80A0A")}
                onBlur={(e) => (e.target.style.borderColor = "#6B728040")}
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "#000000" }}
              >
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg text-sm outline-none transition-all"
                  style={{
                    background: "#FAF9F6",
                    border: "1px solid #6B728040",
                    color: "#000000",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#F80A0A")}
                  onBlur={(e) => (e.target.style.borderColor = "#6B728040")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#6B7280" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-lg px-3.5 py-2.5 text-sm"
                style={{ background: "#F80A0A15", color: "#F80A0A", border: "1px solid #F80A0A30" }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-70 mt-2"
              style={{ background: "#D24A46" }}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn size={16} />
              )}
              {loading ? "Entrando..." : "Entrar"}
            </button>

            {/* Forgot password */}
            <div className="text-center pt-1">
              <button
                type="button"
                className="text-xs underline-offset-2 hover:underline transition-colors"
                style={{ color: "#6B7280" }}
              >
                Esqueci minha senha
              </button>
            </div>
          </form>
        </div>

        {/* Hint */}
        <p className="text-center text-xs mt-4" style={{ color: "#6B7280" }}>
          Demo: admin@barbini.com / admin123
        </p>
      </div>
    </div>
  );
}

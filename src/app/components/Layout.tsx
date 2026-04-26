import React, { useState } from "react";
import { NavLink, Outlet, Navigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/produtos", label: "Produtos", icon: Package },
  { to: "/orcamentos", label: "Orcamentos", icon: FileText },
];

export function Layout() {
  const { logout, userName, isAuthenticated, bootstrapping } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (bootstrapping) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#FAF9F6" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64 flex flex-col
          transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ background: "#FFFDFD", borderRight: "1px solid #F80A0A22" }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "2px solid #F80A0A" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "#F80A0A" }}
            >
              <span className="text-white text-xs font-bold">B</span>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest" style={{ color: "#F80A0A" }}>
                BARBINI
              </p>
              <p className="text-xs" style={{ color: "#6B7280" }}>
                Admin
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded"
            style={{ color: "#6B7280" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                  isActive ? "font-medium" : ""
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? "#F80A0A12" : "transparent",
                color: isActive ? "#F80A0A" : "#000000",
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    style={{ color: isActive ? "#F80A0A" : "#6B7280" }}
                    className="transition-colors"
                  />
                  <span className="text-sm flex-1">{label}</span>
                  {isActive && (
                    <ChevronRight size={14} style={{ color: "#F80A0A" }} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div
          className="px-4 py-4"
          style={{ borderTop: "1px solid #F80A0A22" }}
        >
          <div className="flex items-center gap-3 mb-3 px-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: "#D24A46" }}
            >
              {userName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: "#000000" }}>
                {userName}
              </p>
              <p className="text-xs truncate" style={{ color: "#6B7280" }}>
                admin@barbini.com
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors hover:opacity-80"
            style={{ color: "#D24A46", background: "#D24A4612" }}
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center gap-4 px-6 py-4 shrink-0"
          style={{
            background: "#FFFDFD",
            borderBottom: "1px solid #F80A0A22",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg"
            style={{ color: "#6B7280" }}
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: "#D24A46" }}
          >
            {userName.charAt(0)}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

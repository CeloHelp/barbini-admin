import React from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Clients } from "./pages/Clients";
import { ClientForm } from "./pages/ClientForm";
import { Products } from "./pages/Products";
import { ProductForm } from "./pages/ProductForm";
import { Quotations } from "./pages/Quotations";
import { QuotationDetails } from "./pages/QuotationDetails";
import { QuotationForm } from "./pages/QuotationForm";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", Component: Dashboard },
      { path: "clientes", Component: Clients },
      { path: "clientes/novo", element: <ClientForm mode="create" /> },
      { path: "clientes/:id", element: <ClientForm mode="view" /> },
      { path: "clientes/:id/editar", element: <ClientForm mode="edit" /> },
      { path: "produtos", Component: Products },
      { path: "produtos/novo", element: <ProductForm mode="create" /> },
      { path: "produtos/:id", element: <ProductForm mode="view" /> },
      { path: "produtos/:id/editar", element: <ProductForm mode="edit" /> },
      { path: "orcamentos", Component: Quotations },
      { path: "orcamentos/novo", element: <QuotationForm mode="create" /> },
      { path: "orcamentos/:id", Component: QuotationDetails },
      { path: "orcamentos/:id/editar", element: <QuotationForm mode="edit" /> },
      { path: "*", element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);

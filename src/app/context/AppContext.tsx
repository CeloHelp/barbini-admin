import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { api, getToken, setToken } from "../api/client";
import type { Client, DashboardSummary, Product, Quotation, QuotationPayload, User } from "../api/types";

interface AppContextType {
  isAuthenticated: boolean;
  bootstrapping: boolean;
  loading: boolean;
  userName: string;
  user: User | null;
  dashboard: DashboardSummary | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshAll: () => Promise<void>;
  clients: Client[];
  addClient: (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateClient: (id: string, client: Omit<Client, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  getClient: (id: string) => Client | undefined;
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, product: Omit<Product, "id">) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProduct: (id: string) => Product | undefined;
  quotations: Quotation[];
  getQuotation: (id: string) => Quotation | undefined;
  fetchQuotation: (id: string) => Promise<Quotation>;
  addQuotation: (quotation: QuotationPayload) => Promise<Quotation>;
  updateQuotation: (id: string, quotation: QuotationPayload) => Promise<Quotation>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);

  const isAuthenticated = !!user;
  const userName = user?.name ?? "Administrador";

  async function refreshAll() {
    if (!getToken()) return;
    setLoading(true);
    try {
      const [clientsData, productsData, quotationsData, dashboardData] = await Promise.all([
        api.clients(),
        api.products(),
        api.quotations(),
        api.dashboard(),
      ]);
      setClients(clientsData);
      setProducts(productsData);
      setQuotations(quotationsData);
      setDashboard(dashboardData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function bootstrap() {
      const token = getToken();
      if (!token) {
        setBootstrapping(false);
        return;
      }
      try {
        const session = await api.me();
        setUser(session.user);
        await refreshAll();
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        setBootstrapping(false);
      }
    }
    void bootstrap();
  }, []);

  const value = useMemo<AppContextType>(
    () => ({
      isAuthenticated,
      bootstrapping,
      loading,
      user,
      userName,
      dashboard,
      async login(email, password) {
        try {
          const session = await api.login(email, password);
          setToken(session.token);
          setUser(session.user);
          await refreshAll();
          return true;
        } catch {
          return false;
        }
      },
      logout() {
        setToken(null);
        setUser(null);
        setClients([]);
        setProducts([]);
        setQuotations([]);
        setDashboard(null);
      },
      refreshAll,
      clients,
      async addClient(data) {
        await api.createClient(data);
        await refreshAll();
      },
      async updateClient(id, data) {
        await api.updateClient(id, data);
        await refreshAll();
      },
      async deleteClient(id) {
        await api.deleteClient(id);
        await refreshAll();
      },
      getClient: (id) => clients.find((client) => client.id === id),
      products,
      async addProduct(data) {
        await api.createProduct(data);
        await refreshAll();
      },
      async updateProduct(id, data) {
        await api.updateProduct(id, data);
        await refreshAll();
      },
      async deleteProduct(id) {
        await api.deleteProduct(id);
        await refreshAll();
      },
      getProduct: (id) => products.find((product) => product.id === id),
      quotations,
      getQuotation: (id) => quotations.find((quotation) => quotation.id === id),
      async fetchQuotation(id) {
        return api.quotation(id);
      },
      async addQuotation(data) {
        const quotation = await api.createQuotation(data);
        await refreshAll();
        return quotation;
      },
      async updateQuotation(id, data) {
        const quotation = await api.updateQuotation(id, data);
        await refreshAll();
        return quotation;
      },
    }),
    [bootstrapping, clients, dashboard, isAuthenticated, loading, products, quotations, user, userName],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

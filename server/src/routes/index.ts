import { Router } from "express";
import { dashboardController } from "../controllers/dashboardController.js";
import { asyncHandler } from "../lib/http.js";
import { requireAuth } from "../middleware/auth.js";
import { authRoutes } from "./authRoutes.js";
import { clientRoutes } from "./clientRoutes.js";
import { productRoutes } from "./productRoutes.js";
import { quotationRoutes } from "./quotationRoutes.js";

export const apiRoutes = Router();

apiRoutes.get("/health", (_req, res) => res.json({ ok: true }));
apiRoutes.use("/auth", authRoutes);

apiRoutes.use(requireAuth);
apiRoutes.get("/dashboard", asyncHandler(dashboardController.summary));
apiRoutes.use("/clients", clientRoutes);
apiRoutes.use("/products", productRoutes);
apiRoutes.use("/quotations", quotationRoutes);

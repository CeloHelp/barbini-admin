import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { asyncHandler } from "../lib/http.js";
import { requireAuth } from "../middleware/auth.js";

export const authRoutes = Router();

authRoutes.post("/login", asyncHandler(authController.login));
authRoutes.get("/me", requireAuth, asyncHandler(authController.me));

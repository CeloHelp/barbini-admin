import { Router } from "express";
import { quotationController } from "../controllers/quotationController.js";
import { asyncHandler } from "../lib/http.js";

export const quotationRoutes = Router();

quotationRoutes.get("/", asyncHandler(quotationController.list));
quotationRoutes.post("/", asyncHandler(quotationController.create));
quotationRoutes.get("/:id", asyncHandler(quotationController.find));
quotationRoutes.put("/:id", asyncHandler(quotationController.update));

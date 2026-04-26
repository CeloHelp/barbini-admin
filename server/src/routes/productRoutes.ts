import { Router } from "express";
import { productController } from "../controllers/productController.js";
import { asyncHandler } from "../lib/http.js";

export const productRoutes = Router();

productRoutes.get("/", asyncHandler(productController.list));
productRoutes.post("/", asyncHandler(productController.create));
productRoutes.get("/:id", asyncHandler(productController.find));
productRoutes.put("/:id", asyncHandler(productController.update));
productRoutes.delete("/:id", asyncHandler(productController.remove));

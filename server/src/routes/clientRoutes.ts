import { Router } from "express";
import { clientController } from "../controllers/clientController.js";
import { asyncHandler } from "../lib/http.js";

export const clientRoutes = Router();

clientRoutes.get("/", asyncHandler(clientController.list));
clientRoutes.post("/", asyncHandler(clientController.create));
clientRoutes.get("/:id", asyncHandler(clientController.find));
clientRoutes.put("/:id", asyncHandler(clientController.update));
clientRoutes.delete("/:id", asyncHandler(clientController.remove));

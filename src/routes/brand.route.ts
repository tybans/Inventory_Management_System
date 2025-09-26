import express from "express";
import { createBrand, deleteBrandById, getBrandById, getBrands, updateBrandById } from "@/controllers/brand.controller";


const brandRouter = express.Router();
brandRouter.post("/brands", createBrand)
brandRouter.get("/brands", getBrands)
brandRouter.get("/brands/:id", getBrandById)
brandRouter.put("/brands/:id", updateBrandById)
brandRouter.delete("/brands/:id", deleteBrandById)

export default brandRouter;
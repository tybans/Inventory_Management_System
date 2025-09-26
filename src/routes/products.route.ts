import { createProduct, deleteProductById, getProductById, getProducts, updateProductById } from "@/controllers/products.controller";
import express from "express";


const productRouter = express.Router();
productRouter.post("/products", createProduct)
productRouter.get("/products", getProducts)
productRouter.get("/products/:id", getProductById)
productRouter.put("/products/:id", updateProductById)
productRouter.delete("/products/:id", deleteProductById)

export default productRouter;
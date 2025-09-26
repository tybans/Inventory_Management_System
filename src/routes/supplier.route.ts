import { createSupplier, getSupplier, getSupplierById } from "@/controllers/supplier.controller";
import express from "express";


const supplierRouter = express.Router();

supplierRouter.post("/suppliers", createSupplier)
supplierRouter.get("/suppliers", getSupplier)
supplierRouter.get("/suppliers/:id", getSupplierById)


export default supplierRouter;
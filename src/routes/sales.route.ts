import { createSale, createSaleItem, getSales, getShopSales, getShopsSales } from "@/controllers/sales.controller";
import express from "express";

const salesRouter = express.Router();

salesRouter.post("/sales", createSale);
salesRouter.post("/sales/item", createSaleItem);
salesRouter.get("/sales", getSales)
salesRouter.get("/sales/shop/:shopId", getShopSales)   //  const { shopId } = req.params; //http://localhost:8000/api/sales/shop/68da0544e9e1fc1243393b52
salesRouter.get("/sales/shop", getShopSales)   //    const { shopId } = req.query; //http://localhost:8000/api/sales/shop?shopId=68da0544e9e1fc1243393b52
salesRouter.get("/sales/all-shops", getShopsSales)


export default salesRouter;
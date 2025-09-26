import { createShop, getShopAttendants, getShopById, getShops } from "@/controllers/shop.controller";
import express from "express";

const shopRouter = express.Router();

shopRouter.post("/shops", createShop)
shopRouter.get("/shops", getShops)
shopRouter.get("/shops/:id", getShopById)
shopRouter.get("/attendants/shop/:shopId", getShopAttendants)

export default shopRouter;
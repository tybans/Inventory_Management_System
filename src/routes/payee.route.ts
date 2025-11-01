
import { createPayee, deletePayeeById, getPayeeById, getPayees, updatePayeeById } from "@/controllers/payee.controller";
import express from "express";
const payeeRouter = express.Router();
payeeRouter.post("/payees", createPayee)
payeeRouter.get("/payees", getPayees)
payeeRouter.get("/payees/:id", getPayeeById)
payeeRouter.put("/payees/:id", updatePayeeById)
payeeRouter.delete("/payees/:id", deletePayeeById)

export default payeeRouter;
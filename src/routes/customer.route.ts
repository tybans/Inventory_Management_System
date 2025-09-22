import { createCustomers, getCustomerById, getCustomers } from "@/controllers/customer.controller";
import express from "express";


const customersRouter = express.Router();

customersRouter.post("/customers", createCustomers)
customersRouter.get("/customers", getCustomers )
customersRouter.get("/customers/:id", getCustomerById)

export default customersRouter;
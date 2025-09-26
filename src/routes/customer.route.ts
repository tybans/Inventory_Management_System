import { createCustomer, getCustomerById, getCustomers } from "@/controllers/customer.controller";
import express from "express";


const customersRouter = express.Router();

customersRouter.post("/customers", createCustomer)
customersRouter.get("/customers", getCustomers )
customersRouter.get("/customers/:id", getCustomerById)

export default customersRouter;
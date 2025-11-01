

import { createExpense, deleteExpenseById, getExpenseById, getExpenses, updateExpenseById } from "@/controllers/expense.controller";
import express from "express";
const expenseRouter = express.Router();
expenseRouter.post("/expenses", createExpense)
expenseRouter.get("/expenses", getExpenses)
expenseRouter.get("/expenses/:id", getExpenseById)
expenseRouter.put("/expenses/:id", updateExpenseById)
expenseRouter.delete("/expenses/:id", deleteExpenseById)

export default expenseRouter;
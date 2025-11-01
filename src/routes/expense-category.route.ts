
import { createExpenseCategory, deleteExpenseCategoryById, getExpenseCategories, getExpenseCategoryById, updateExpenseCategoryById } from "@/controllers/expense-category.controller";
import express from "express";
const expenseCategoryRouter = express.Router();
expenseCategoryRouter.post("/expense-categories", createExpenseCategory)
expenseCategoryRouter.get("/expense-categories", getExpenseCategories)
expenseCategoryRouter.get("/expense-categories/:id", getExpenseCategoryById)
expenseCategoryRouter.put("/expense-categories/:id", updateExpenseCategoryById)
expenseCategoryRouter.delete("/expense-categories/:id", deleteExpenseCategoryById)

export default expenseCategoryRouter;
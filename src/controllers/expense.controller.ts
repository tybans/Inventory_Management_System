import { Request, Response } from "express"
import { db } from "@/db/db"


export async function createExpense(req: Request, res: Response) {
  try {
    // Check the data
    const {
      title,
      amount,
      description,
      attachments,
      expenseDate,
      payeeId,
      categoryId,
      shopId
    } = req.body
    // check if expense already exists
    // Because there is no unique field other than id, we will not check for existing expense


    // create Expense
    const newExpense = await db.expense.create({
      data: {
        title,
        amount,
        description,
        attachments,
        expenseDate,
        payeeId,
        categoryId,
        shopId
      }
    })


    // return the created Expense
    return res.status(201).json({ data: newExpense, error: null })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}


export async function getExpenses(req: Request, res: Response) {
  try {
    const expenses = await db.expense.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return res.status(200).json({ data: expenses, error: null })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}

export async function getExpenseById(req: Request, res: Response) {
  try {
    const { id } = req.params
    const existingExpense = await db.expense.findUnique({
      where: {
        id: id
      }
    })
    if (!existingExpense) {
      return res.status(404).json({
        data: null,
        error: "Expense not found"
      })
    }
    return res.status(200).json({ data: existingExpense, error: null })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}

export async function updateExpenseById(req: Request, res: Response) {
  const { id } = req.params
  const {
    title,
    amount,
    description,
    attachments,
    expenseDate,
    payeeId,
    categoryId,
    shopId } = req.body
  try {
    // If existing Expense
    const existingExpense = await db.expense.findUnique({
      where: {
        id: id
      }
    })
    // if not exist we run 404
    if (!existingExpense) {
      return res.status(404).json({
        data: null,
        error: "Expense not found"
      });
    }


    // update the Expense
    const updatedExpense = await db.expense.update({
      where: {
        id: id
      },
      data: {
        title,
        amount,
        description,
        attachments,
        expenseDate,
        payeeId,
        categoryId,
        shopId
      }
    })
    // return the updated Expense


    return res.status(200).json({
      data: updatedExpense,
      error: null
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}


export async function deleteExpenseById(req: Request, res: Response) {
  const { id } = req.params
  try {
    const expense = await db.expense.findUnique({
      where: {
        id: id
      }
    })

    if (!expense) {
      return res.status(404).json({
        data: null,
        error: "Expense not found"
      });
    }

    // const deletedExpense = await db.expense.delete({
    await db.expense.delete({
      where: {
        id: id
      }
    })

    return res.status(200).json({
      success: true,
      error: null
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}
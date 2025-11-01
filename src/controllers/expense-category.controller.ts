import { Request, Response } from "express"
import { db } from "@/db/db"


export async function createExpenseCategory(req: Request, res: Response) {
  try {
    // Check the data
    const {
      name,
      slug,
    } = req.body
    // check if expense Category already exists
    const existingExpenseCategory = await db.expenseCategory.findUnique({
      where: {
        slug: slug
      }
    })
    if (existingExpenseCategory) {
      return res.status(409).json({
        message: `Expense Category with this slug ${slug} already exists`,
        data: null
      })
    }

    // create Expense category
    const newExpenseCategory = await db.expenseCategory.create({
      data: {
        name, slug
      }
    })


    // return the created Expense category
    return res.status(201).json({ data: newExpenseCategory, error: null })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}


export async function getExpenseCategories(req: Request, res: Response) {
  try {
    const expenseCategories = await db.expenseCategory.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return res.status(200).json({ data: expenseCategories, error: null })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}

export async function getExpenseCategoryById(req: Request, res: Response) {
  try {
    const { id } = req.params
    const existingExpenseCategory = await db.expenseCategory.findUnique({
      where: {
        id: id
      }
    })
    if (!existingExpenseCategory) {
      return res.status(404).json({
        data: null,
        error: "Expense Category not found"
      })
    }
    return res.status(200).json({ data: existingExpenseCategory, error: null })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}

export async function updateExpenseCategoryById(req: Request, res: Response) {
  const { id } = req.params
  const {
    name,
      slug, } = req.body
  try {
    // If existing Expense Category
    const existingExpenseCategory = await db.expenseCategory.findUnique({
      where: {
        id: id
      }
    })
    // if not exist we run 404
    if (!existingExpenseCategory) {
      return res.status(404).json({
        data: null,
        error: "Expense Category not found"
      });
    }
    // if slug is unique
    if ( slug !== existingExpenseCategory.slug) {
      const expenseCategoryWithSlug = await db.expenseCategory.findUnique({
        where: {
          slug: slug
        }
      })
      if (expenseCategoryWithSlug) {
        return res.status(409).json({
          data: null,
          error: "Slug already in use"
        });
      }
    }

    // update the Expense Category
    const updatedExpenseCategory = await db.expenseCategory.update({
      where: {
        id: id
      },
      data: {
        name,
        slug,
      }
    })
    // return the updated Expense Category


    return res.status(200).json({
      data: updatedExpenseCategory,
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


export async function deleteExpenseCategoryById(req: Request, res: Response) {
  const { id } = req.params
  try {
    const expenseCategory = await db.expenseCategory.findUnique({
      where: {
        id: id
      }
    })

    if (!expenseCategory) {
      return res.status(404).json({
        data: null,
        error: "Expense Category not found"
      });
    }

    // const deletedExpenseCategory = await db.expenseCategory.delete({
    await db.expenseCategory.delete({
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
import { Request, Response } from "express"
import { db } from "@/db/db"


export async function createCategory(req: Request, res: Response) {
  try {
    // Check the data
    const {
      name,
      slug,
    } = req.body
    // check if Category already exists
    const existingCategory = await db.category.findUnique({
      where: {
        slug: slug
      }
    })
    if (existingCategory) {
      return res.status(409).json({
        message: `Category with this slug ${slug} already exists`,
        data: null
      })
    }

    // create category
    const newCategory = await db.category.create({
      data: {
        name, slug
      }
    })


    // return the created category
    return res.status(201).json({ data: newCategory, error: null })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}


export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return res.status(200).json({ data: categories, error: null })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}

export async function getCategoryById(req: Request, res: Response) {
  try {
    const { id } = req.params
    const existingCategory = await db.category.findUnique({
      where: {
        id: id
      }
    })
    if (!existingCategory) {
      return res.status(404).json({
        data: null,
        error: "Category not found"
      })
    }
    return res.status(200).json({ data: existingCategory, error: null })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}

export async function updateCategoryById(req: Request, res: Response) {
  const { id } = req.params
  const {
    name,
      slug, } = req.body
  try {
    // If existing Category
    const existingCategory = await db.category.findUnique({
      where: {
        id: id
      }
    })
    // if not exist we run 404
    if (!existingCategory) {
      return res.status(404).json({
        data: null,
        error: "Category not found"
      });
    }
    // if slug is unique
    if ( slug !== existingCategory.slug) {
      const categoryWithSlug = await db.category.findUnique({
        where: {
          slug: slug
        }
      })
      if (categoryWithSlug) {
        return res.status(409).json({
          data: null,
          error: "Slug already in use"
        });
      }
    }

    // update the Category
    const updatedCategory = await db.category.update({
      where: {
        id: id
      },
      data: {
        name,
        slug,
      }
    })
    // return the updated Category


    return res.status(200).json({
      data: updatedCategory,
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


export async function deleteCategoryById(req: Request, res: Response) {
  const { id } = req.params
  try {
    const category = await db.category.findUnique({
      where: {
        id: id
      }
    })

    if (!category) {
      return res.status(404).json({
        data: null,
        error: "Category not found"
      });
    }

    // const deletedCategory = await db.category.delete({
    await db.category.delete({
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
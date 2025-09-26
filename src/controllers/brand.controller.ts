import { Request, Response } from "express"
import { db } from "@/db/db"


export async function createBrand(req: Request, res: Response) {
  try {
    // Check the data
    const {
      name,
      slug,
    } = req.body
    // check if brand already exists
    const existingBrand = await db.brand.findUnique({
      where: {
        slug: slug
      }
    })
    if (existingBrand) {
      return res.status(409).json({
        message: `Brand with this slug ${slug} already exists`,
        data: null
      })
    }

    // create Brand
    const newBrand = await db.brand.create({
      data: {
        name, slug
      }
    })


    // return the created brand
    return res.status(201).json({ data: newBrand, error: null })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}


export async function getBrands(req: Request, res: Response) {
  try {
    const brands = await db.brand.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return res.status(200).json({ data: brands, error: null })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}

export async function getBrandById(req: Request, res: Response) {
  try {
    const { id } = req.params
    const existingBrand = await db.brand.findUnique({
      where: {
        id: id
      }
    })
    if (!existingBrand) {
      return res.status(404).json({
        data: null,
        error: "Brand not found"
      })
    }
    return res.status(200).json({ data: existingBrand, error: null })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}

export async function updateBrandById(req: Request, res: Response) {
  const { id } = req.params
  const {
    name,
      slug, } = req.body
  try {
    // If existing Brand
    const existingBrand = await db.brand.findUnique({
      where: {
        id: id
      }
    })
    // if not exist we run 404
    if (!existingBrand) {
      return res.status(404).json({
        data: null,
        error: "Brand not found"
      });
    }
    // if slug is unique
    if ( slug !== existingBrand.slug) {
      const brandWithSlug = await db.brand.findUnique({
        where: {
          slug: slug
        }
      })
      if (brandWithSlug) {
        return res.status(409).json({
          data: null,
          error: "Slug already in use"
        });
      }
    }

    // update the Brand
    const updatedBrand = await db.brand.update({
      where: {
        id: id
      },
      data: {
        name,
        slug,
      }
    })
    // return the updated brand


    return res.status(200).json({
      data: updatedBrand,
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


export async function deleteBrandById(req: Request, res: Response) {
  const { id } = req.params
  try {
    const brand = await db.brand.findUnique({
      where: {
        id: id
      }
    })

    if (!brand) {
      return res.status(404).json({
        data: null,
        error: "Brand not found"
      });
    }

    // const deletedBrand = await db.brand.delete({
    await db.brand.delete({
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
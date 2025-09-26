import { Request, Response } from "express"
import { db } from "@/db/db"


export async function createShop(req: Request, res: Response) {
  try {
    // Check the data
    const { name, slug, location, adminId, attendantIds } = req.body
    // check if shop already exists
    const existingShop = await db.shop.findUnique({
      where: {
        slug: slug
      }
    })
    if (existingShop) {
      return res.status(409).json({
        message: `Shop with this slug ${slug} already exists`,
        data: null
      })
    }

    // create shop
    const newShop = await db.shop.create({
      data: {
        name, slug, location, adminId, attendantIds
      }
    })


    // return the created shop
    return res.status(201).json({ data: newShop, error: null })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}


export async function getShops(req: Request, res: Response) {
  try {
    const shops = await db.shop.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return res.status(200).json({ data: shops, error: null })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}

export async function getShopById(req: Request, res: Response) {
  try {
    const { id } = req.params
    const existingShop = await db.shop.findUnique({
      where: {
        id: id
      }
    })
    if (!existingShop) {
      return res.status(404).json({
        data: null,
        error: "Shop not found"
      })
    }
    return res.status(200).json({ data: existingShop, error: null })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}


export async function getShopAttendants(req: Request, res: Response) {
  try {
    const { shopId } = req.params

    const existingShop = await db.shop.findUnique({
      where: {
        id: shopId
      },
    })

    if (!existingShop) {
      return res.status(404).json({
        data: null,
        error: "Shop not found"
      })
    }

    // Get the users whose Ids are equal to existing shop attendantIds
    const attendants = await db.user.findMany({
      where: {
        id: { in: existingShop.attendantIds }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        image: true
      }
    })


    return res.status(200).json({ data: attendants, error: null })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}
import { Request, Response } from "express"
import { db } from "@/db/db"


export async function createUnit(req: Request, res: Response) {
  try {
    // Check the data
    const {
      name,
      abbreviation,
      slug,
    } = req.body
    // check if unit already exists
    const existingUnit = await db.unit.findUnique({
      where: {
        slug: slug
      }
    })
    if (existingUnit) {
      return res.status(409).json({
        message: `Unit with this slug ${slug} already exists`,
        data: null
      })
    }

    // create Unit
    const newUnit = await db.unit.create({
      data: {
        name, slug, abbreviation
      }
    })


    // return the created Unit
    return res.status(201).json({ data: newUnit, error: null })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}


export async function getUnits(req: Request, res: Response) {
  try {
    const units = await db.unit.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return res.status(200).json({ data: units, error: null })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}

export async function getUnitById(req: Request, res: Response) {
  try {
    const { id } = req.params
    const existingUnit = await db.unit.findUnique({
      where: {
        id: id
      }
    })
    if (!existingUnit) {
      return res.status(404).json({
        data: null,
        error: "Unit not found"
      })
    }
    return res.status(200).json({ data: existingUnit, error: null })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}

export async function updateUnitById(req: Request, res: Response) {
  const { id } = req.params
  const {
    name,
    abbreviation,
    slug, } = req.body
  try {
    // If existing Unit
    const existingUnit = await db.unit.findUnique({
      where: {
        id: id
      }
    })
    // if not exist we run 404
    if (!existingUnit) {
      return res.status(404).json({
        data: null,
        error: "Unit not found"
      });
    }
    // if slug is unique
    if ( slug !== existingUnit.slug) {
      const unitWithSlug = await db.unit.findUnique({
        where: {
          slug: slug
        }
      })
      if (unitWithSlug) {
        return res.status(409).json({
          data: null,
          error: "Slug already in use"
        });
      }
    }

    // update the Unit
    const updatedUnit = await db.unit.update({
      where: {
        id: id
      },
      data: {
        name,
        abbreviation,
        slug,
      }
    })
    // return the updated Unit


    return res.status(200).json({
      data: updatedUnit,
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


export async function deleteUnitById(req: Request, res: Response) {
  const { id } = req.params
  try {
    const unit = await db.unit.findUnique({
      where: {
        id: id
      }
    })

    if (!unit) {
      return res.status(404).json({
        data: null,
        error: "Unit not found"
      });
    }

    // const deletedUnit = await db.unit.delete({
    await db.unit.delete({
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
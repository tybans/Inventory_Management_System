import { Request, Response } from "express"
import { db } from "@/db/db"


export async function createPayee(req: Request, res: Response) {
  try {
    // Check the data
    const {
      name,
      phone,
    } = req.body
    // check if payee already exists
    const existingPayee = await db.payee.findUnique({
      where: {
        phone: phone
      }
    })
    if (existingPayee) {
      return res.status(409).json({
        message: `Payee with this Phone Number ${phone} already exists`,
        data: null
      })
    }

    // create Payee
    const newPayee = await db.payee.create({
      data: {
        name, phone
      }
    })


    // return the created Payee
    return res.status(201).json({ data: newPayee, error: null })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}


export async function getPayees(req: Request, res: Response) {
  try {
    const payees = await db.payee.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return res.status(200).json({ data: payees, error: null })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}

export async function getPayeeById(req: Request, res: Response) {
  try {
    const { id } = req.params
    const existingPayee = await db.payee.findUnique({
      where: {
        id: id
      }
    })
    if (!existingPayee) {
      return res.status(404).json({
        data: null,
        error: "Payee not found"
      })
    }
    return res.status(200).json({ data: existingPayee, error: null })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}

export async function updatePayeeById(req: Request, res: Response) {
  const { id } = req.params
  const {
    name,
    phone, } = req.body
  try {
    // If existing Payee
    const existingPayee = await db.payee.findUnique({
      where: {
        id: id
      }
    })
    // if not exist we run 404
    if (!existingPayee) {
      return res.status(404).json({
        data: null,
        error: "Payee not found"
      });
    }
    // if phone is unique
    if (phone !== existingPayee.phone) {
      const payeeWithPhone = await db.payee.findUnique({
        where: {
          phone: phone
        }
      })
      if (payeeWithPhone) {
        return res.status(409).json({
          data: null,
          error: "Phone Number already in use"
        });
      }
    }

    // update the Payee
    const updatedPayee = await db.payee.update({
      where: {
        id: id
      },
      data: {
        name,
        phone,
      }
    })
    // return the updated Payee


    return res.status(200).json({
      data: updatedPayee,
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


export async function deletePayeeById(req: Request, res: Response) {
  const { id } = req.params
  try {
    const payee = await db.payee.findUnique({
      where: {
        id: id
      }
    })

    if (!payee) {
      return res.status(404).json({
        data: null,
        error: "Payee not found"
      });
    }

    // const deletedPayee = await db.payee.delete({
    await db.payee.delete({
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
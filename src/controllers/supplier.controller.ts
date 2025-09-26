import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createSupplier(req: Request, res: Response) {
  const {
    supplierType,
    name,
    contactPerson,
    phone,
    email,
    location,
    country,
    website,
    taxPin,
    regNumber,
    bankAccountNumber,
    bankName,
    paymentTerms,
    logo,
    rating,
    notes
  } = req.body;


  try {
    // Check if email, phone or nationalIdNumber are unique
    if (email) {
      const existingSupplierByEmail = await db.supplier.findUnique({
        where: {
          email: email
        }
      })
      if (existingSupplierByEmail) {
        return res.status(409).json({
          message: `Supplier with this email ${email} already exists`,
          data: null
        })

      }
    }
    const existingSupplierByPhone = await db.supplier.findUnique({
      where: {
        phone: phone
      }
    })
    if (existingSupplierByPhone) {
      return res.status(409).json({
        message: `Supplier with this Phone Number ${phone} already exists`,
        data: null
      })

    }
    if (regNumber) {
      const existingSupplierByRegNumber = await db.supplier.findUnique({
        where: {
          regNumber: regNumber
        }
      })
      if (existingSupplierByRegNumber) {
        return res.status(409).json({
          message: `Supplier with this Registration Number ${regNumber} already exists`,
          data: null
        })

      }
    }

    // Create the supplier
    const newSupplier = await db.supplier.create({
      data: {
        supplierType,
        name,
        contactPerson,
        phone,
        email,
        location,
        country,
        website,
        taxPin,
        regNumber,
        bankAccountNumber,
        bankName,
        paymentTerms,
        logo,
        rating,
        notes
      }
    })
    // Return the created supplier
    return res.status(201).json(newSupplier)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", data: null });
  }


}

export async function getSupplier(req: Request, res: Response) {
  try {
    const suppliers = await db.supplier.findMany(
      {
        orderBy: { createdAt: 'desc' }

      }
    );
    return res.status(200).json(suppliers);
  } catch (error) {
    console.log(error);
    
  }
}

export async function getSupplierById(req: Request, res: Response) {
  const { id } = req.params
  try {
    const supplier = await db.supplier.findUnique({
      where: {
        id: id
      }
    })

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found", data: null });
    }
    return res.status(200).json(supplier)
  } catch (error) {
    console.log(error);

  }
}
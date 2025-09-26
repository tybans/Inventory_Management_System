import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createCustomer(req: Request, res: Response) {

  const { 
    customerType,
    firstName,
    lastName,
    phone,
    gender,
    country,
    location,
    maxCreditLimit,
    maxCreditDays,
    taxPin,
    dob,
    email,
    nationalIdNumber 
  } = req.body
  try {
    // Check if email, phone or nationalIdNumber are unique
    if (email) {
      const existingCustomerByEmail = await db.customer.findUnique({
        where: {
          email: email
        }
      })
      if (existingCustomerByEmail) {
        return res.status(409).json({
          message: `Customer with this email ${email} already exists`,
          data: null
        })

      }
    }
    const existingCustomerByPhone = await db.customer.findUnique({
      where: {
        phone: phone
      }
    })
    if (existingCustomerByPhone) {
      return res.status(409).json({
        message: `Customer with this Phone Number ${phone} already exists`,
        data: null
      })

    }
    if (nationalIdNumber) {
      const existingCustomerByNationalId = await db.customer.findUnique({
        where: {
          nationalIdNumber: nationalIdNumber
        }
      })
      if (existingCustomerByNationalId) {
        return res.status(409).json({
          message: `Customer with this National ID Number ${nationalIdNumber} already exists`,
          data: null
        })

      }
    }

    // Create the Customer
    const newCustomer = await db.customer.create({
      data: {
        customerType,
        firstName,
        lastName,
        phone,
        gender,
        country,
        location,
        maxCreditLimit,
        maxCreditDays,
        taxPin,
        dob,
        email,
        nationalIdNumber
      }
    })
    // Return the created customer
    return res.status(201).json(newCustomer)
  } catch (error) {
    console.log(error);
  }

}
export async function getCustomers(req: Request, res: Response) {
  try {
    const customers = await db.customer.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return res.status(200).json(customers)
  } catch (error) {
    console.log(error);

  }

  
}


export async function getCustomerById(req: Request, res: Response) {
  const { id } = req.params
  try {
    const customer = await db.customer.findUnique({
      where: {
        id: id
      }
    })

    if (!customer) {
      return res.status(404).json({ message: "Customer not found", data: null });
    }
    return res.status(200).json(customer)
  } catch (error) {
    console.log(error);

  }
}
import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createCustomers(req: Request, res: Response) {

  const { name, email, phone } = req.body
  try {
    const newCustomer = await db.customer.create({
      data: {
        name,
        email,
        phone
      }
    })
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
  
  // const customers = [
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     email: "john.doe@example.com",
  //     phone: "+1234567890"
  //   },
  //   {
  //     id: 2,
  //     name: "Joel Smith",
  //     email: "joel.smith@example.com",
  //     phone: "+0987654321",
  //   },
  //   {
  //     id: 3,
  //     name: "tybans",
  //     email: "tybansh@example.com",
  //     phone: "912827347",
  //   },
  //   {
  //     name: "tybans",
  //     email: "tybansh@example.com",
  //     phone: "912827347",
  //   },
  // ];

  // return res.status(200).json(customers);
}


export async function getCustomerById(req: Request, res: Response) {
  const { id } = req.params
  try {
    const customer = await db.customer.findUnique({
      where: {
        id: id
      }
    })
    return res.status(200).json(customer)
  } catch (error) {
    console.log(error);
    
  }
}
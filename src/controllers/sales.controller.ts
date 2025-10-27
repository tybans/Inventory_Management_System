import { Request, Response } from "express"
import { db } from "@/db/db"
import { generateSaleNumber } from "@/utils/generateSaleNumber"
import { SaleRequestBody } from "@/types/types"
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  endOfDay,
  endOfWeek,
  endOfMonth,
} from "date-fns";



export async function createSale(req: Request, res: Response) {
  const {
    customerId,
    customerName,
    // saleNumber,  // Because it is auto generated
    customerEmail,
    saleAmount,
    balanceAmount,
    paidAmount,
    saleType,
    paymentMethod,
    shopId,
    transactionCode,
    saleItems
  }: SaleRequestBody = req.body
  try {
    const saleId = await db.$transaction(async (transaction) => {
      // $transaction is a special Prisma Client method used to run multiple database operations as a single atomic transaction.
      // Either all database queries inside $transaction succeed together, or if any one fails, everything is rolled back.
      /*
        db            → your Prisma client instance
        $transaction  → starts a new transaction session
        transaction   → gives you a special transactional version of Prisma client
      */

      // Create the sale

      // If the balanceAmount is greater than 0,
      if (balanceAmount > 0) {
        // If the customer is allowed to tkae credit
        const existingCustomer = await transaction.customer.findUnique({
          where: { id: customerId },
        })


        if (!existingCustomer) {
          return res.status(404).json({
            success: false,
            data: null,
            error: `Customer with ID ${customerId} not found`,
          });
        }

        if (balanceAmount > (existingCustomer.maxCreditLimit || 0)) {
          return res.status(403).json({
            data: null,
            error: `Customer with ID ${customerId} exceeds max credit limit of ${balanceAmount}`,
          });
        }

        // Update the customer unpaidAmount
        // Update the customer MaxCredit Amount
        const updatedCustomer = await transaction.customer.update({  // why transaction.customer? because we are in a transaction 
          where: { id: customerId },
          data: {
            unpaidCreditAmount: existingCustomer.unpaidCreditAmount + balanceAmount,
            maxCreditLimit: {
              decrement: balanceAmount,
            }
          },
        });

        if (!updatedCustomer) {
          return res.status(404).json({
            data: null,
            error: `Customer with ID ${customerId} not found`,
          });
        }

      }
      const sale = await transaction.sale.create({
        data: {
          customerId,
          customerName,
          saleNumber: generateSaleNumber(),
          customerEmail,
          saleAmount,
          balanceAmount,
          paidAmount,
          saleType,
          paymentMethod,
          shopId,
          transactionCode
        },
      });
      if (saleItems && saleItems.length > 0) {
        for (const item of saleItems) {
          // Update Product stock quantity
          const updatedProduct = await transaction.product.update({
            where: { id: item.productId },
            data: {
              stockQty: {
                decrement: item.qty,
              },
            },
          });

          if (!updatedProduct) {
            return res.status(404).json({
              data: null,
              error: `Product with ID ${item.productId} not found`,
            });
          }

          // Create Sale Item
          const saleItem = await transaction.saleItem.create({
            data: {
              saleId: sale.id,
              productId: item.productId,
              qty: item.qty,
              productPrice: item.qty,
              productName: item.productName,
              productImage: item.productImage,
            },
          });

          if (!saleItem) {
            return res.status(500).json({
              data: null,
              error: "Failed to create sale item",
            });
          }

        }
      }
      return sale.id;
    });

    const sale = await db.sale.findUnique({
      where: {
        id: saleId as string
      },
      include: {
        saleItems: true,
      },
    });
    return res.status(201).json({ data: sale, error: null });
  } catch (error) {
    console.error("Transaction error:", error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}


export async function createSaleItem(req: Request, res: Response) {
  const { saleId,
    productId,
    qty,
    productPrice,
    productName,
    productImage } = req.body
  try {
    // Update Product stock quantity
    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: {
        stockQty: {
          decrement: qty,
        },
      },
    });

    // Create Sale Item
    const saleItem = await db.saleItem.create({
      data: {
        saleId,
        productId,
        qty,
        productPrice,
        productName,
        productImage
      }
    });

    return res.status(201).json({ data: saleItem, error: null });
  } catch (error) {
    console.error("Transaction error:", error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}

export async function getSales(req: Request, res: Response) {
  try {
    const sales = await db.sale.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        saleItems: true,
      }
    })
    return res.status(200).json({ data: sales, error: null })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}


export async function getShopSales(req: Request, res: Response) {
  const { shopId } = req.params;
  // const { shopId } = req.query;

   const existingShop = await db.shop.findUnique({
    where: {
      id: shopId 
    },
  })
  if (!existingShop) {
    return res.status(404).json({
      error: `Shop with ID ${shopId} not found`,
      data: null,
    });
  }

  // Define time periods
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());

  try {
    // Fetch sales for different periods
    const categorizeSales = async (sales: any[]) => {
      return {
        totalSales: sales,
        salesPaidInCash: sales.filter(
          (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount <= 0
        ),
        salesPaidInCredit: sales.filter(
          (sale) => sale.balanceAmount > 0
        ),
        salesByUpi: sales.filter(
          (sale) => sale.paymentMethod === "UPI"
        ),
        // salesByHandCash: sales.filter(
        //   (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount <= 0
        // ),
      };
    };

    const salesToday = await db.sale.findMany({
      where: {
        shopId,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    const salesThisWeek = await db.sale.findMany({
      where: {
        shopId,
        createdAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    });

    const salesThisMonth = await db.sale.findMany({
      where: {
        shopId,
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    const salesAllTime = await db.sale.findMany({
      where: {
        shopId,
      },
    });

    res.status(200).json({
      today: await categorizeSales(salesToday),
      thisWeek: await categorizeSales(salesThisWeek),
      thisMonth: await categorizeSales(salesThisMonth),
      allTime: await categorizeSales(salesAllTime),
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
  }
}


export async function getShopsSales(req: Request, res: Response) {
  // Define time periods
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());

  try {
    // Fetch sales data with all necessary fields for categorization
    const fetchSalesData = async (startDate: Date, endDate: Date) => {
      return await db.sale.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          shopId: true, 
          saleAmount: true, 
          paymentMethod: true, 
          balanceAmount: true, 
          saleType: true
        },
      });
    }
    const categorizeSales = (sales: any[]) => {
      return {
        totalSales: sales,
        salesPaidInCash: sales.filter(
          (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount <= 0
        ),
        salesPaidInCredit: sales.filter(
          (sale) => sale.balanceAmount > 0
        ),
        salesByUpi: sales.filter(
          (sale) => sale.paymentMethod === "UPI"
        ),
        // salesByHandCash: sales.filter(
        //   (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount <= 0
        // ),
      };
    };

    // Fetch and categories sales data for each period
    const salesToday = await fetchSalesData(todayStart, todayEnd);
    const salesThisWeek = await fetchSalesData(weekStart, weekEnd);
    const salesThisMonth = await fetchSalesData(monthStart, monthEnd);
    // const salesAllTime = await fetchSalesData(new Date(0), new Date());
    const salesAllTime = await db.sale.findMany({
      select: {
        shopId: true, 
        saleAmount: true,
        paymentMethod: true,
        balanceAmount: true,
        saleType: true
      },
    });

    

    res.status(200).json({
      today: categorizeSales(salesToday),
      thisWeek: categorizeSales(salesThisWeek),
      thisMonth: categorizeSales(salesThisMonth),
      allTime: categorizeSales(salesAllTime),
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
  }
}
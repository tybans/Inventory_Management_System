import { PaymentMethod, SaleType } from "@prisma/client"


export interface SaleRequestBody {
  customerId: string
  customerName: string
  customerEmail: string
  saleAmount: number
  balanceAmount: number
  paidAmount: number
  saleType: SaleType
  paymentMethod: PaymentMethod
  shopId: string
  transactionCode: string
  saleItems: SaleItem[]
}

export interface SaleItem {
  saleId: string
  productId: string
  qty: number
  productPrice: number
  productName: string
  productImage: string
}
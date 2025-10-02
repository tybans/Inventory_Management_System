import { Request, Response } from "express"
import { db } from "@/db/db"


export async function createProduct(req: Request, res: Response) {
  try {
    // Check the data
    const {
      name,
      description,
      batchNumber,
      barCode,
      image,
      tax,
      alertQty,
      stockQty,
      price,
      buyingPrice,
      sku,
      productCode,
      slug,
      supplierId,
      unitId,
      brandId,
      categoryId,
      expiryDate,
      wholesalePrice,
      shopId
    } = req.body
    // check if Product already exists and barCode, sku, productCode, slug are unique
    const existingProductBySlug = await db.product.findUnique({
      where: {
        slug: slug
      }
    })
    if (existingProductBySlug) {
      return res.status(409).json({
        message: `Product with this slug ${slug} already exists`,
        data: null
      })
    }

    const existingProductByBarCode = await db.product.findUnique({
      where: {
        barCode: barCode
      }
    })
    if (barCode && existingProductByBarCode) {
      return res.status(409).json({
        message: `Product with this barCode ${barCode} already exists`,
        data: null
      })
    }

    const existingProductBySku = await db.product.findUnique({
      where: {
        sku: sku
      }
    })
    if (existingProductBySku) {
      return res.status(409).json({
        message: `Product with this sku ${sku} already exists`,
        data: null
      })
    }
    const existingProductByProductCode = await db.product.findUnique({
      where: {
        productCode: productCode
      }
    })
    if (existingProductByProductCode) {
      return res.status(409).json({
        message: `Product with this productCode ${productCode} already exists`,
        data: null
      })
    }

    // create Product
    const newProduct = await db.product.create({
      data: {
        name,
        description,
        batchNumber,
        barCode,
        image,
        tax,
        alertQty,
        stockQty,
        price,
        buyingPrice,
        sku,
        productCode,
        slug,
        supplierId,
        unitId,
        brandId,
        categoryId,
        expiryDate,
        wholesalePrice,
        shopId
      }
    })


    // return the created Product
    return res.status(201).json({ data: newProduct, error: null })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}


export async function getProducts(req: Request, res: Response) {
  try {
    const products = await db.product.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return res.status(200).json({ data: products, error: null })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params
    const existingProduct = await db.product.findUnique({
      where: {
        id: id
      }
    })
    if (!existingProduct) {
      return res.status(404).json({
        data: null,
        error: "Product not found"
      })
    }
    return res.status(200).json({ data: existingProduct, error: null })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Internal Server Error"
    })
  }
}

export async function updateProductById(req: Request, res: Response) {
  const { id } = req.params
  const {
    name,
    description,
    batchNumber,
    barCode,
    image,
    tax,
    alertQty,
    stockQty,
    price,
    buyingPrice,
    sku,
    productCode,
    slug,
    supplierId,
    unitId,
    brandId,
    categoryId,
    expiryDate,
    wholesalePrice,
    shopId
  } = req.body
  try {
    // If existing Product
    const existingProduct = await db.product.findUnique({
      where: {
        id: id
      }
    })
    // if not exist we run 404
    if (!existingProduct) {
      return res.status(404).json({
        data: null,
        error: "Product not found"
      });
    }
    // if slug, barCode, sku, productCode unique
    if (slug !== existingProduct.slug) {
      const productWithSlug = await db.product.findUnique({
        where: {
          slug: slug
        }
      })
      if (productWithSlug) {
        return res.status(409).json({
          data: null,
          error: "Slug already in use"
        });
      }
    }

    if (barCode && barCode !== existingProduct.barCode) {
      const productWithBarCode = await db.product.findUnique({
        where: {
          barCode: barCode
        }
      })
      if (productWithBarCode) {
        return res.status(409).json({
          data: null,
          error: "BarCode already in use"
        });
      }
    }

    if (sku !== existingProduct.sku) {
      const productWithSku = await db.product.findUnique({
        where: {
          sku: sku
        }
      })
      if (productWithSku) {
        return res.status(409).json({
          data: null,
          error: "Sku already in use"
        });
      }
    }

    if (productCode !== existingProduct.productCode) {
      const productWithProductCode = await db.product.findUnique({
        where: {
          productCode: productCode
        }
      })
      if (productWithProductCode) {
        return res.status(409).json({
          data: null,
          error: "ProductCode already in use"
        });
      }
    }

    // update the Product
    const updatedProduct = await db.product.update({
      where: {
        id: id
      },
      data: {
        name,
        description,
        batchNumber,
        barCode,
        image,
        tax,
        alertQty,
        stockQty,
        price,
        buyingPrice,
        sku,
        productCode,
        slug,
        supplierId,
        unitId,
        brandId,
        categoryId,
        expiryDate,
        wholesalePrice,
        shopId
      }
    })
    // return the updated Product


    return res.status(200).json({
      data: updatedProduct,
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


export async function deleteProductById(req: Request, res: Response) {
  const { id } = req.params
  try {
    const product = await db.product.findUnique({
      where: {
        id: id
      }
    })

    if (!product) {
      return res.status(404).json({
        data: null,
        error: "Product not found"
      });
    }

    // const deletedProduct = await db.product.delete({
    await db.product.delete({
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
import { db } from "."
import { ProductModel } from "@/models"

import { IProduct } from "@/interfaces"

export const getProductBySlug = async (slug: string): Promise<IProduct | null> => {
  await db.connect()

  const product = await ProductModel
    .findOne({ slug })
    .lean()

  await db.disconnect()

  if (!product) return null

  product.images = product.images.map(image => {
    return image.includes('https') ? image : `${process.env.HOST_NAME}products/${image}`
  })

  return JSON.parse(JSON.stringify(product))
}

export const getAllProductSlugs = async (): Promise<string[]> => {
  await db.connect()

  const slugs = await ProductModel.distinct('slug')

  await db.disconnect()

  return slugs
}

export const getProductsByTerm = async (term: string): Promise<IProduct[]> => {
  await db.connect()

  term = term?.toString().toLocaleLowerCase() as string

  const products = await ProductModel
    .find({
      $text: { $search: term }
    })
    .select({
      _id: 0,
      slug: 1,
      inStock: 1,
      images: 1,
      price: 1,
      title: 1
    })
    .lean()

  await db.disconnect()

  const updatedProducts = products.map(product => {
    product.images = product.images.map(image => {
      return image.includes('https') ? image : `${process.env.HOST_NAME}products/${image}`
    })

    return product
  })

  return JSON.parse(JSON.stringify(updatedProducts))
}

export const getAllProducts = async (): Promise<IProduct[]> => {
  await db.connect()

  const products = await ProductModel
    .find()
    .select({
      _id: 0,
      slug: 1,
      inStock: 1,
      images: 1,
      price: 1,
      title: 1
    })
    .lean()

  await db.disconnect()

  const updatedProducts = products.map(product => {
    product.images = product.images.map(image => {
      return image.includes('https') ? image : `${process.env.HOST_NAME}products/${image}`
    })

    return product
  })

  return JSON.parse(JSON.stringify(updatedProducts))
}
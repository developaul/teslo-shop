import type { NextApiRequest, NextApiResponse } from 'next'

import { ProductModel } from '@/models'
import { SHOP_CONSTANTS, db } from '@/database'

import { IProduct } from '@/interfaces'

type Data =
  | { message: string }
  | IProduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  switch (req.method) {
    case 'GET':
      return getProducts(req, res)

    default:
      return res.status(400).json({ message: 'Bad request' })
  }

}


const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

  const { gender = 'all' } = req.query
  const query = SHOP_CONSTANTS.validGenders.includes(`${gender}`) ? { gender } : {}

  await db.connect()

  const products = await ProductModel
    .find(query)
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

  return res.status(200).json(updatedProducts)
}


import type { NextApiRequest, NextApiResponse } from 'next'

import { ProductModel } from '@/models'
import { db } from '@/database'

import { IProduct } from '@/interfaces'

type Data =
  | { message: string }
  | IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProductBySlug(req, res)

    default:
      return res.status(400).json({ message: 'Bad request' })
  }

}


const getProductBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

  const { slug } = req.query

  await db.connect()

  const product = await ProductModel
    .findOne({ slug })
    .lean()

  await db.disconnect()

  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' })
  }

  product.images = product.images.map(image => {
    return image.includes('https') ? image : `${process.env.HOST_NAME}products/${image}`
  })

  return res.status(200).json(product)
}


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
      return searchProducts(req, res)

    default:
      return res.status(400).json({ message: 'Bad request' })
  }

}


const searchProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

  let { q } = req.query

  q = q?.toString().toLocaleLowerCase() as string

  await db.connect()

  const products = await ProductModel
    .find({
      $text: { $search: q }
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

  return res.status(200).json(products)
}


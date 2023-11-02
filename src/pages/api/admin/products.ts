import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/database'
import { ProductModel } from '@/models'

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
  await db.connect()
  const products = await ProductModel
    .find({})
    .sort({ title: 'asc' })
    .lean()
  await db.disconnect()

  // TODO: Tendremos que actualizar las imagenes

  return res.status(200).json(products)
}


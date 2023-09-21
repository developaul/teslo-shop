import type { NextApiRequest, NextApiResponse } from 'next'

import { db, seedDatabase } from '@/database'

import { ProductModel } from '@/models'

type Data = {
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  if (process.env.NODE_ENV === 'production') {
    return res
      .status(401)
      .json({ message: 'No tiene acceso a este servicio' })
  }

  await db.connect()

  await ProductModel.deleteMany()

  await ProductModel.insertMany(seedDatabase.initialData.products)

  await db.disconnect()

  res
    .status(200)
    .json({ message: 'Proceso realizado correctamente' })
}
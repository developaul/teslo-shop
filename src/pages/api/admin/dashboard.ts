import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/database'

import { DashboardInfo } from '@/interfaces'
import { OrderModel, ProductModel, UserModel } from '@/models'

type Data =
  | { message: string }
  | DashboardInfo

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getDasboardInfo(req, res)

    default:
      return res.status(400).json({ message: 'Bad request' })
  }
}

const getDasboardInfo = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

  await db.connect()
  const [
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  ] = await Promise.all([
    OrderModel.countDocuments(),
    OrderModel.countDocuments({ isPaid: true }),
    UserModel.countDocuments({ role: 'client' }),
    ProductModel.countDocuments(),
    ProductModel.countDocuments({ inStock: 0 }),
    ProductModel.countDocuments({ inStock: { $lte: 10 } })
  ])
  await db.disconnect()

  return res.status(200).json({
    numberOfOrders,
    paidOrders,
    notPaidOrders: numberOfOrders - paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory
  })
}


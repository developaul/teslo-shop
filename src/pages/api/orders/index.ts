import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/database'

import { IOrder } from '@/interfaces'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { OrderModel, ProductModel } from '@/models'

type Data =
  | { message: string }
  | IOrder

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return createOrder(req, res)

    default:
      return res.status(400).json({ message: 'Bad request' })
  }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderItems, orderCartSummary } = req.body as IOrder
  const { total } = orderCartSummary

  // Verificar que tengamos un usuario
  const session: any = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ message: 'Debe de estar autenticado para realizar esta accion' })

  const productIds = orderItems.map(({ _id }) => String(_id))

  await db.connect()
  const products = await ProductModel
    .find({ _id: { $in: productIds } })
    .lean()

  try {
    const subTotal = orderItems.reduce((prev, current) => {
      const currentProduct = products.find(product => String(product._id) === String(current._id))

      if (!currentProduct) {
        throw new Error('Verifique el carrito de nuevo, producto no existe')
      }

      return prev + (currentProduct!.price * current.quantity)
    }, 0)

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE ?? 0)
    const backendTotal = subTotal * (taxRate + 1)

    if (total !== backendTotal) throw new Error('El total no cuadra con el monto')

    const userId = session.user._id
    const newOrder = new OrderModel({ ...req.body, isPaid: false, user: userId })
    newOrder.orderCartSummary.total = Math.round(newOrder.orderCartSummary.total * 100) / 100

    await newOrder.save()
    await db.disconnect()

    return res.status(201).json(newOrder)

  } catch (error: any) {
    await db.disconnect()
    console.log(error)
    return res.status(400).json({ message: error.message ?? 'Revise logs del servidor' })
  }
}


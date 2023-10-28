import { IOrder } from "@/interfaces";
import { isValidObjectId } from "mongoose";

import { OrderModel } from "@/models";
import { db } from ".";

export const getOrderById = async (id: string): Promise<IOrder | null> => {
  if (!isValidObjectId(id)) return null

  db.connect()
  const order = await OrderModel.findById(id).lean()
  db.disconnect()

  if (!order) return null

  return JSON.parse(JSON.stringify(order))
}

export const getOrdersByUserId = async (userId: string): Promise<IOrder[]> => {
  if (!isValidObjectId(userId)) return []

  db.connect()
  const orders = await OrderModel.find({ user: userId }).lean()
  db.disconnect()

  return JSON.parse(JSON.stringify(orders))
}
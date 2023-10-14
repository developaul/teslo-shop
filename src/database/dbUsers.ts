import bcrypt from 'bcryptjs'

import { UserModel } from "@/models"
import { db } from "."

export const checkUserEmailPassword = async (email: string, password: string) => {
  await db.connect()
  const user = await UserModel.findOne({ email }).lean()
  await db.disconnect()

  if (!user) return null

  if (!bcrypt.compareSync(password, user.password!)) return null

  const { _id, name, role } = user

  return { _id, name, role, email: email.toLocaleLowerCase() }
}

// crea o verifica el usuario de OAuth
export const oAuthDbUser = async (oAuthEmail: string, oAuthName: string) => {
  await db.connect()
  const user = await UserModel.findOne({ email: oAuthEmail })

  if (user) {
    await db.disconnect()

    const { _id, name, role, email } = user

    return { _id, name, role, email }
  }

  const newUser = new UserModel({ email: oAuthEmail.toLocaleLowerCase(), password: '@', name: oAuthName, role: 'client' })
  await newUser.save()
  await db.disconnect()


  console.log('Usuario creado')

  const { _id, name, role, email } = newUser

  return { _id, name, role, email }
}
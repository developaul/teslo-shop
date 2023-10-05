import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'

import User from '@/models/User'

import { db } from '@/database'
import { IUser } from '@/interfaces'
import { jwt, validations } from '@/utils'

type Data =
  | { message: string }
  | { token: string, user: Pick<IUser, '_id' | 'email' | 'name' | 'role'> }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return registerUser(req, res)

    default:
      res.status(400).json({ message: 'Bad request' })
  }
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { name = '', email = '', password = '' } = req.body

  // validate inputs
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password debe ser de 6 caracteres' })
  }

  if (name.length < 3) {
    return res.status(400).json({ message: 'El nombre debe de ser de 2 caracteres' })
  }

  if (!validations.isValidEmail(email)) {
    return res.status(400).json({ message: 'El email invalido' })
  }

  await db.connect()
  const user = await User.findOne({ email }).lean()

  if (user) {
    await db.disconnect()
    return res.status(400).json({ message: 'Ese correo ya esta registrado' })
  }

  const newUser = new User({
    email: email.toLocaleLowerCase(),
    password: bcrypt.hashSync(password),
    name,
    role: 'client'
  })

  try {
    await newUser.save({ validateBeforeSave: true })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Revisar logs del servidor' })
  }

  const { role, _id } = newUser

  const token = jwt.signToken({ _id, email })

  res.status(200).json({ token, user: { _id, role, name, email } })
}

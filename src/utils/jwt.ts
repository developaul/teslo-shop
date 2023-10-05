import jwt from 'jsonwebtoken'

import { IUser } from '@/interfaces'

export const signToken = ({ _id, email }: Pick<IUser, '_id' | 'email'>) => {
  if (!process.env.JWT_SECRET_SEED) throw new Error('No hay semilla de JWT')

  return jwt.sign({ _id, email }, process.env.JWT_SECRET_SEED, { expiresIn: '30d' })
}

export const isValidToken = (token: string): Promise<string> => {
  if (!process.env.JWT_SECRET_SEED) throw new Error('No hay semilla de JWT')

  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.JWT_SECRET_SEED!, (error, payload) => {
        if (error) return reject('JWT no es valido')
        const { _id } = payload as { _id: string }
        resolve(_id)
      })
    } catch (error) {
      reject('JWT no es valido')
    }
  })
}
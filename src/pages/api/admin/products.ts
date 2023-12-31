import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'

import { db } from '@/database'
import { ProductModel } from '@/models'

import { IProduct } from '@/interfaces'

cloudinary.config(process.env.CLOUDINARY_URL ?? '')

type Data =
  | { message: string }
  | IProduct[]
  | IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res)

    case 'PUT':
      return updateProduct(req, res)

    case 'POST':
      return createProduct(req, res)

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

  const updatedProducts = products.map(product => {
    product.images = product.images.map(image => {
      return image.includes('https') ? image : `${process.env.HOST_NAME}products/${image}`
    })

    return product
  })

  return res.status(200).json(updatedProducts)
}

const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { _id = '', images = [] } = req.body as IProduct

  if (!isValidObjectId(_id)) return res.status(400).json({ message: 'El id del producto no es valido' })

  if (images.length < 2) return res.status(400).json({ message: 'Es necesario al menos 2 imagenes' })

  // TODO: Posiblemente tendremos un localhost:3000/products/asddsadsa.jpg

  try {
    await db.connect()
    const product = await ProductModel.findById(_id)

    if (!product) {
      await db.disconnect()
      return res.status(400).json({ message: 'No existe ese producto' })
    }

    product.images.forEach(async (image) => {
      if (images.includes(image) || !image.startsWith('https')) return

      const [fileId, extension] = image.substring(image.lastIndexOf('/') + 1).split('.')
      console.log("eliminando imagenes", { fileId, extension, image })

      await cloudinary.uploader.destroy(fileId)
    })

    await product.updateOne(req.body)

    await db.disconnect()

    return res.status(200).json(product)
  } catch (error) {
    console.log('updateProduct error -> ', error)
    await db.disconnect()
    return res.status(400).json({ message: 'Revisar la consola del servidor' })
  }
}


const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { images = [], slug } = req.body as IProduct

  if (images.length < 2) return res.status(400).json({ message: 'Es necesario al menos 2 imagenes' })

  // TODO: Posiblemente tendremos un localhost:3000/products/asddsadsa.jpg

  try {
    await db.connect()

    const productInDB = await ProductModel.findOne({ slug }).lean()
    if (productInDB) {
      await db.disconnect()
      return res.status(400).json({ message: 'Ya existe un producto con ese slug' })
    }

    const product = new ProductModel(req.body)
    product.save()
    await db.disconnect()

    return res.status(201).json(product)
  } catch (error) {
    console.log('createProduct error -> ', error)
    await db.disconnect()
    return res.status(400).json({ message: 'Revisar la consola del servidor' })
  }
}

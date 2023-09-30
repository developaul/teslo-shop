import { ICartProduct } from "@/interfaces"

export const productsAreEqual = (firstProduct: ICartProduct, secondProduct: ICartProduct): boolean => {
  return (firstProduct._id === secondProduct._id) && (firstProduct.size === secondProduct.size)
}


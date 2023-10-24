import { createContext } from 'react';

import { ICartProduct, OrderCartSummary, ShippingAddress } from '@/interfaces';

interface ContextProps {
  isLoaded: boolean
  cart: ICartProduct[]
  orderSummary: OrderCartSummary
  shippingAddress?: ShippingAddress
  addProductToCart: (product: ICartProduct) => void
  updateCartQuantity: (product: ICartProduct) => void
  removeCartProduct: (product: ICartProduct) => void
  updateShippingAddress: (shippingAddress: ShippingAddress) => void
  createOrder: () => Promise<{ hasError: boolean; message: string }>
}

export const CartContext = createContext({} as ContextProps)
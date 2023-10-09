import { createContext } from 'react';

import { ICartProduct } from '@/interfaces';
import { OrderCartSummary, ShippingAddress } from '.';

interface ContextProps {
  isLoaded: boolean
  cart: ICartProduct[]
  orderSummary: OrderCartSummary
  shippingAddress?: ShippingAddress
  addProductToCart: (product: ICartProduct) => void
  updateCartQuantity: (product: ICartProduct) => void
  removeCartProduct: (product: ICartProduct) => void
}

export const CartContext = createContext({} as ContextProps)
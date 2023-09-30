import { FC, ReactElement, useEffect, useMemo, useReducer } from 'react'
import Cookie from 'js-cookie'

import { CartContext, cartReducer } from './'
import { ICartProduct } from '@/interfaces'
import { productsAreEqual } from '@/utils'

export interface CartState {
  cart: ICartProduct[]
}

export interface OrderCartSummary {
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
}

const CART_INITIAL_STATE: CartState = {
  cart: []
}

interface Props {
  children: ReactElement | ReactElement[]
}

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

  useEffect(() => {
    try {
      const cookieProducts = JSON.parse(Cookie.get('cart') ?? '') ?? []
      dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: cookieProducts })
    } catch (error) {
      dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: [] })
    }
  }, [])

  const orderSummary = useMemo(() => {
    const numberOfItems = state.cart.reduce((prev, current) => prev + current.quantity, 0)
    const subTotal = state.cart.reduce((prev, current) => prev + (current.price * current.quantity), 0)
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE ?? 0)

    return {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * (taxRate + 1)
    }
  }, [state.cart])

  const addProductToCart = (newProduct: ICartProduct) => {
    const productInCart = state.cart.some((product) => productsAreEqual(product, newProduct))

    if (!productInCart) {
      Cookie.set('cart', JSON.stringify(state.cart.concat(newProduct)))
      return dispatch({ type: '[Cart] - Update products in cart', payload: state.cart.concat(newProduct) })
    }

    const updatedProducts = state.cart
      .map((product) => {
        if (!productsAreEqual(product, newProduct)) return product

        return { ...product, quantity: product.quantity + newProduct.quantity }
      })

    Cookie.set('cart', JSON.stringify(updatedProducts))
    dispatch({ type: '[Cart] - Update products in cart', payload: updatedProducts })
  }

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Change cart quantity', payload: product })
  }

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Remove product in cart', payload: product })
  }


  return (
    <CartContext.Provider
      value={{
        ...state,
        orderSummary,
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
      }}>
      {children}
    </CartContext.Provider>
  )
}
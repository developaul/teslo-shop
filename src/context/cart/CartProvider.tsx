import { FC, ReactElement, useEffect, useMemo, useReducer } from 'react'
import Cookies from 'js-cookie'

import { CartContext, cartReducer } from './'
import { ICartProduct } from '@/interfaces'
import { productsAreEqual, getAddressFromCookies } from '@/utils'

export interface CartState {
  cart: ICartProduct[]
  isLoaded: boolean
  shippingAddress?: ShippingAddress
}

export interface OrderCartSummary {
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  shippingAddress: undefined
}

interface Props {
  children: ReactElement | ReactElement[]
}

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

  useEffect(() => {
    try {
      const cookieProducts = JSON.parse(Cookies.get('cart') ?? '') ?? []
      dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: cookieProducts })
    } catch (error) {
      dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: [] })
    }
  }, [])

  useEffect(() => {
    try {
      const shippingAddress = getAddressFromCookies()
      dispatch({ type: '[Cart] - LoadAddress from cookies', payload: shippingAddress })
    } catch (error) {}
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
      Cookies.set('cart', JSON.stringify(state.cart.concat(newProduct)))
      return dispatch({ type: '[Cart] - Update products in cart', payload: state.cart.concat(newProduct) })
    }

    const updatedProducts = state.cart
      .map((product) => {
        if (!productsAreEqual(product, newProduct)) return product

        return { ...product, quantity: product.quantity + newProduct.quantity }
      })

    Cookies.set('cart', JSON.stringify(updatedProducts))
    dispatch({ type: '[Cart] - Update products in cart', payload: updatedProducts })
  }

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Change cart quantity', payload: product })
  }

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Remove product in cart', payload: product })
  }

  const updateShippingAddress = (data: ShippingAddress) => {
    Cookies.set('firstName', data.firstName)
    Cookies.set('lastName', data.lastName)
    Cookies.set('address', data.address)
    Cookies.set('address2', data.address2 ?? '')
    Cookies.set('zip', data.zip)
    Cookies.set('city', data.city)
    Cookies.set('country', data.country)
    Cookies.set('phone', data.phone)

    dispatch({ type: '[Cart] - Update Address', payload: data })
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        orderSummary,
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        updateShippingAddress
      }}>
      {children}
    </CartContext.Provider>
  )
}
import Cookies from 'js-cookie'

import { ICartProduct } from "@/interfaces"
import { FormData } from '@/pages/checkout/address'
import { countries } from '.'

export const productsAreEqual = (firstProduct: ICartProduct, secondProduct: ICartProduct): boolean => {
  return (firstProduct._id === secondProduct._id) && (firstProduct.size === secondProduct.size)
}

export const getAddressFromCookies = ():FormData => {
  return {
    firstName: Cookies.get('firstName') ?? '',
    lastName: Cookies.get('lastName') ?? '',
    address: Cookies.get('address') ?? '',
    address2: Cookies.get('address2') ?? '',
    zip: Cookies.get('zip') ?? '',
    city: Cookies.get('city') ?? '',
    country: Cookies.get('country') ?? countries[0].code,
    phone: Cookies.get('phone') ?? '',
  }
}
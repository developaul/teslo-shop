import { IUser } from ".";

export interface IOrder {
  _id?: string;
  user?: IUser | string;
  orderItems: IOrderItem[]
  shippingAddress: ShippingAddress
  paymentResutl?: string;
  orderCartSummary: OrderCartSummary;
  isPaid: boolean;
  paidAt?: string;
  transactionId?: string;
  createdAt: string;
}

export interface IOrderItem {
  _id: string;
  title: string;
  size: string;
  quantity: number;
  slug: string
  image: string;
  price: number;
  gender: string;
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

export interface OrderCartSummary {
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
}
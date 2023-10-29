import { GetServerSideProps, NextPage } from 'next'
import { getServerSession } from 'next-auth'
import NextLink from 'next/link'
import { useState } from 'react'
import { PayPalButtons } from '@paypal/react-paypal-js'
import {
  Box, Card, CardContent, Chip, CircularProgress, Divider,
  Grid, Link, Typography
} from '@mui/material'
import { useRouter } from 'next/router'

import { ShopLayout } from '@/components/layouts'
import { CartList, OrdenSummary } from '@/components/cart'
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material'
import { authOptions } from '../api/auth/[...nextauth]'
import tesloApi from '@/api/tesloApi'

import { dbOrders } from '@/database'
import { IOrder } from '@/interfaces'

interface OrderResponseBody {
  status:
  | "CREATED"
  | "SAVED"
  | "APPROVED"
  | "VOIDED"
  | "COMPLETED"
  | "PAYER_ACTION_REQUIRED"
  id: string
}

interface Props {
  order: IOrder
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const router = useRouter()

  const [isPaying, setIsPaying] = useState(false)

  const { shippingAddress, orderCartSummary } = order

  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== 'COMPLETED') return alert('No hay pago en Paypal')

    setIsPaying(true)

    try {
      await tesloApi.post('orders/pay', { orderId: order._id, transactionId: details.id })
      router.reload()
    } catch (error) {
      setIsPaying(false)
      console.log(error)
      alert('Error')
    }
  }

  return (
    <ShopLayout title='Resumen de la orden' pageDescription='Resumen de la orden'>
      <Typography variant='h1' component='h1' >Resumen: {order._id}</Typography>
      {order.isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label='Orden ya fue pagada'
          variant='outlined'
          color='success'
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label='Pendiente de pago'
          variant='outlined'
          color='error'
          icon={<CreditCardOffOutlined />}
        />
      )}

      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList products={order.orderItems} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>Resumen ({order.orderCartSummary.numberOfItems} {order.orderCartSummary.numberOfItems > 1 ? 'productos' : 'producto'})</Typography>
              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='space-between'>
                <Typography variant='subtitle1'>Direccion de entrega</Typography>

                <NextLink legacyBehavior href='/checkout/address' passHref>
                  <Link underline='always'>
                    Editar
                  </Link>
                </NextLink>
              </Box>

              <Typography>{shippingAddress.firstName} {shippingAddress.lastName}</Typography>
              <Typography>{shippingAddress.address} {shippingAddress.address2 ? `, ${shippingAddress.address2}` : ''}</Typography>
              <Typography>{shippingAddress.city}, {shippingAddress.zip}</Typography>
              <Typography>{shippingAddress.country}</Typography>
              <Typography>{shippingAddress.phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <OrdenSummary orderSummary={orderCartSummary} />

              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>

                <Box sx={{ display: isPaying ? 'flex' : 'none' }} display='flex' justifyContent='center' className='fadeIn'>
                  <CircularProgress />
                </Box>

                <Box sx={{ display: isPaying ? 'none' : 'flex', flex: 1, flexDirection: 'column' }}>
                  {(order.isPaid ? (
                    <Chip
                      sx={{ my: 2 }}
                      label='Orden ya fue pagada'
                      variant='outlined'
                      color='success'
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <PayPalButtons
                      createOrder={(_, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: `${order.orderCartSummary.total}`
                              }
                            }
                          ]
                        })
                      }}
                      onApprove={(_, actions) => {
                        return actions.order!.capture().then(details => {
                          onOrderCompleted(details)
                        })
                      }}
                    />
                  )
                  )}
                </Box>

              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  const { id = '' } = query

  const session: any = await getServerSession(req, res, authOptions)

  if (!session)
    return {
      redirect: {
        destination: `/auth/login?p=orders/${id}`,
        permanent: false
      }
    }

  const order = await dbOrders.getOrderById(id.toString())

  if (!order)
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false
      }
    }

  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false
      }
    }
  }

  return {
    props: {
      order
    }
  }
}

export default OrderPage
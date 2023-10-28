import { GetServerSideProps, NextPage } from 'next'
import { getServerSession } from 'next-auth'
import NextLink from 'next/link'
import {
  Box, Card, CardContent, Chip, Divider,
  Grid, Link, Typography
} from '@mui/material'

import { ShopLayout } from '@/components/layouts'
import { CartList, OrdenSummary } from '@/components/cart'
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material'
import { authOptions } from '../api/auth/[...nextauth]'
import { dbOrders } from '@/database'
import { IOrder } from '@/interfaces'

interface Props {
  order: IOrder
}

const OrderPage: NextPage<Props> = ({ order }) => {

  const { shippingAddress, orderCartSummary } = order

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
                {order.isPaid ? (
                  <Chip
                    sx={{ my: 2 }}
                    label='Orden ya fue pagada'
                    variant='outlined'
                    color='success'
                    icon={<CreditScoreOutlined />}
                  />
                ) : (
                  <h1>Pagar</h1>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>)
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
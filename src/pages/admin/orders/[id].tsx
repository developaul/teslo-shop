import { GetServerSideProps, NextPage } from 'next'
import {
  Box, Card, CardContent, Chip, Divider,
  Grid, Typography
} from '@mui/material'
import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material'

import { AdminLayout } from '@/components/layouts'
import { CartList, OrdenSummary } from '@/components/cart'

import { dbOrders } from '@/database'
import { IOrder } from '@/interfaces'


interface Props {
  order: IOrder
}

const OrderPage: NextPage<Props> = ({ order }) => {

  const { shippingAddress, orderCartSummary } = order

  return (
    <AdminLayout title='Resumen de la orden' subTitle={`Orden ID: ${order._id}`} icon={<AirplaneTicketOutlined />}>
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
              </Box>

              <Typography>{shippingAddress.firstName} {shippingAddress.lastName}</Typography>
              <Typography>{shippingAddress.address} {shippingAddress.address2 ? `, ${shippingAddress.address2}` : ''}</Typography>
              <Typography>{shippingAddress.city}, {shippingAddress.zip}</Typography>
              <Typography>{shippingAddress.country}</Typography>
              <Typography>{shippingAddress.phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <OrdenSummary orderSummary={orderCartSummary} />

              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>

                <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                  {(order.isPaid ? (
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
                  )
                  )}
                </Box>

              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  const { id = '' } = query

  const order = await dbOrders.getOrderById(id.toString())

  if (!order)
    return {
      redirect: {
        destination: `/admin/orders`,
        permanent: false
      }
    }

  return {
    props: {
      order
    }
  }
}

export default OrderPage
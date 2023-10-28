import { GetServerSideProps, NextPage } from 'next'
import { getServerSession } from 'next-auth'
import NextLink from 'next/link'
import { Chip, Grid, Link, Typography } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"

import { ShopLayout } from "@/components/layouts"
import { authOptions } from '../api/auth/[...nextauth]'
import { dbOrders } from '@/database'
import { IOrder } from '@/interfaces'
import { useMemo } from 'react'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullname', headerName: 'Nombre Completo', width: 300 },
  {
    field: 'paid',
    headerName: 'Pagada',
    description: 'Muestra informacion si esta pagada o no',
    width: 200,
    renderCell: (params) => {
      return (
        params.row.paid
          ? <Chip color="success" label='Pagada' variant='outlined' />
          : <Chip color="error" label='No pagada' variant='outlined' />
      )
    }
  },
  {
    field: 'order',
    headerName: 'Ver orden',
    description: 'Ver pagina de la orden',
    width: 200,
    sortable: false,
    renderCell: (params) => {
      return (
        <NextLink legacyBehavior href={`/orders/${params.row.orderId}`} passHref>
          <Link underline='always'>
            Ver orden
          </Link>
        </NextLink>
      )
    }
  },
]

interface Props {
  orders: IOrder[]
}

const HistoryPage: NextPage<Props> = ({ orders }) => {

  const rows = useMemo(() => {
    return orders.map((order, index) => ({ id: index + 1, paid: order.isPaid, fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`, orderId: order._id }))

  }, [orders])

  return (
    <ShopLayout
      title="Historial de ordenes"
      pageDescription="Historial de ordenes del cliente">
      <Typography variant="h1" component='h1'>Historial de ordenes</Typography>

      <Grid container>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            columns={columns}
            rows={rows}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5 }
              },
            }}
            pageSizeOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

  const session: any = await getServerSession(req, res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login?p=/orders/history',
        permanent: false
      }
    }
  }

  const orders = await dbOrders.getOrdersByUserId(session.user._id)

  return {
    props: {
      orders
    }
  }
}

export default HistoryPage
import NextLink from 'next/link'
import { useMemo } from 'react'
import useSWR from 'swr'
import { PeopleOutline } from '@mui/icons-material'
import { Chip, Grid, Link } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

import { AdminLayout } from '@/components/layouts'
import { IOrder, IUser } from '@/interfaces'

const OrdersPage = () => {

  const { data, isLoading } = useSWR<IOrder[]>('/api/admin/orders')

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Orden ID', width: 250 },
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre completo', width: 300 },
    { field: 'total', headerName: 'Monto total', width: 300 },
    {
      field: 'isPaid',
      headerName: 'Pagada',
      description: 'Muestra informacion si esta pagada o no',
      width: 200,
      renderCell: (params) => {
        return (
          params.row.isPaid
            ? <Chip color="success" label='Pagada' variant='outlined' />
            : <Chip color="error" label='No pagada' variant='outlined' />
        )
      }
    },
    { field: 'inStock', headerName: 'No.Productos', align: 'center', width: 150 },
    {
      field: 'check',
      headerName: 'Ver orden',
      description: 'Muestra informacion si esta pagada o no',
      width: 200,
      renderCell: (params) => {
        return (
          <NextLink legacyBehavior href={`/admin/orders/${params.row.id}`} target='_blank' rel='noreferrer' passHref>
            <Link underline='always'>
              Ver orden
            </Link>
          </NextLink>
        )
      }
    },
    { field: 'createdAt', headerName: 'Fecha de creacion', width: 300 },
  ]

  const rows = useMemo(() => {
    return (data ?? []).map(({ _id, isPaid, orderCartSummary, orderItems, user, createdAt }) => ({
      email: (user as IUser).email,
      isPaid,
      name: (user as IUser).name,
      id: _id,
      total: orderCartSummary.total,
      inStock: orderItems.length,
      createdAt
    }))
  }, [data])

  if (isLoading) return <></>

  return (
    <AdminLayout
      title='Ordenes'
      subTitle='Mantenimiento de ordenes'
      icon={<PeopleOutline />}
    >
      <Grid className='fadeIn' container>
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
    </AdminLayout>
  )
}

export default OrdersPage
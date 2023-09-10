import NextLink from 'next/link'
import { Chip, Grid, Link, Typography } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"

import { ShopLayout } from "@/components/layouts"

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
        <NextLink legacyBehavior href={`/orders/${params.row.id}`} passHref>
          <Link underline='always'>
            Ver orden
          </Link>
        </NextLink>
      )
    }
  },
]

const rows = [
  { id: 1, paid: true, fullname: 'Paul Chavez' },
  { id: 2, paid: false, fullname: 'Melissa Flores' },
  { id: 3, paid: true, fullname: 'Hernando Vallejo' },
  { id: 4, paid: false, fullname: 'Emin Reyes' },
  { id: 5, paid: false, fullname: 'Eduardo Rios' },
  { id: 6, paid: true, fullname: 'Natalian Herra' },
]

const HistoryPage = () => {
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

export default HistoryPage
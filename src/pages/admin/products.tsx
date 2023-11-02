import { useMemo } from 'react'
import useSWR from 'swr'
import { CardMedia, Grid } from '@mui/material'
import { CategoryOutlined } from '@mui/icons-material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

import { AdminLayout } from '@/components/layouts'
import { IProduct, } from '@/interfaces'

const columns: GridColDef[] = [
  {
    field: 'img',
    headerName: 'Foto',
    renderCell: ({ row }) => {
      return (
        <a href={`/product/${row.slug}`} target='_blank' rel="noreferrer">
          <CardMedia
            component='img'
            alt={row.title}
            className='fadeIn'
            image={`/products/${row.img}`}
          />
        </a>
      )
    }
  },
  { field: 'title', headerName: 'Titulo', width: 250 },
  { field: 'gender', headerName: 'Genero' },
  { field: 'type', headerName: 'Tipo' },
  { field: 'inStock', headerName: 'Inventario' },
  { field: 'price', headerName: 'Precio' },
  { field: 'sizes', headerName: 'Tallas', width: 250 }
]

const ProductsPage = () => {

  const { data, isLoading } = useSWR<IProduct[]>('/api/admin/products')

  const rows = useMemo(() => {
    return (data ?? []).map(({
      _id,
      images,
      title,
      gender,
      type,
      inStock,
      price,
      sizes,
      slug
    }) => ({
      id: _id,
      img: images[0],
      title,
      gender,
      type,
      inStock,
      price,
      sizes: sizes.join(', '),
      slug
    }))
  }, [data])

  if (isLoading) return <></>

  return (
    <AdminLayout
      title={`Productos (${data!.length})`}
      subTitle='Mantenimiento de productos'
      icon={<CategoryOutlined />}
    >
      <Grid className='fadeIn' container>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            columns={columns}
            rows={rows}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 }
              },
            }}
            pageSizeOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default ProductsPage
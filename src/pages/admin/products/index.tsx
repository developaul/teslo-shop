import { useMemo } from 'react'
import NextLink from 'next/link'
import useSWR from 'swr'
import { Box, Button, CardMedia, Grid, Link } from '@mui/material'
import { AddOutlined, CategoryOutlined } from '@mui/icons-material'
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
            image={row.img}
          />
        </a>
      )
    }
  },
  {
    field: 'title',
    headerName: 'Titulo',
    width: 250,
    renderCell: ({ row }) => {
      return (
        <Link
          underline='always'
          component={NextLink}
          href={`/admin/products/${row.slug}`}>
          {row.title}
        </Link>
      )
    }
  },
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
      <Box sx={{ display: 'flex', justifyContent: 'end', mb: 2 }}>
        <Button
          startIcon={<AddOutlined />}
          color='secondary'
          href='/admin/products/new'>
          Crear producto
        </Button>
      </Box>
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
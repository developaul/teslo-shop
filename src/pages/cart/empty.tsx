import NextLink from 'next/link'
import { ShopLayout } from "@/components/layouts"
import { Box, Link, Typography } from "@mui/material"
import { RemoveShoppingCartOutlined } from "@mui/icons-material"

const EmptyPage = () => {
  return (
    <ShopLayout title="Carrito vacio" pageDescription="No hay articulos en el carrito de compras">
      <Box
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
        display='flex' justifyContent='center' alignItems='center' height='calc(100vh - 200px)'>
        <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
        <Box
          flexDirection='column'
          alignItems='center'
          display='flex'>
          <Typography>Su carrito esta vacio</Typography>

          <NextLink href='/' passHref legacyBehavior>
            <Link typography='h4' color='secondary'>
              Regresar
            </Link>
          </NextLink>
        </Box>
      </Box>
    </ShopLayout>
  )
}

export default EmptyPage
import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Box, Button, Card, CardContent, Divider,
  Grid, Typography
} from '@mui/material'

import { CartContext } from '@/context'
import { ShopLayout } from '@/components/layouts'
import { CartList, OrdenSummary } from '@/components/cart'

const CartPage = () => {

  const router = useRouter()

  const { isLoaded, cart } = useContext(CartContext)

  useEffect(() => {
    if (!isLoaded) return
    if (cart.length) return

    router.replace('/cart/empty')
  }, [isLoaded, cart, router])

  if (!isLoaded || !cart.length) return (<></>)

  return (
    <ShopLayout title='Carrito - 3' pageDescription='Carrito de compras de la tienda'>
      <Typography variant='h1' component='h1' >Carrito</Typography>

      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList editable />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>Orden</Typography>
              <Divider sx={{ my: 1 }} />

              <OrdenSummary />

              <Box sx={{ mt: 3 }}>
                <Button
                  href='/checkout/address'
                  color='secondary'
                  className='circular-btn'
                  fullWidth>
                  Checkout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </ShopLayout>
  )
}

export default CartPage
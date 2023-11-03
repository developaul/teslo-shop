import { FC, useContext } from 'react'
import NextLink from 'next/link'
import {
  Box, Button, CardActionArea,
  CardMedia, Grid, Link, Typography
} from "@mui/material"

import { ItemCounter } from '../ui'
import { CartContext } from '@/context'
import { ICartProduct, IOrderItem } from '@/interfaces'

interface Props {
  editable?: boolean
  products?: IOrderItem[]
}

export const CartList: FC<Props> = ({ editable = false, products }) => {

  const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext)

  const onNewCartQuantityValue = (product: ICartProduct, quantity: number) => {
    updateCartQuantity({ ...product, quantity })
  }

  const productsToShow = products ?? cart

  return (
    <>
      {
        (productsToShow).map(product => (
          <Grid
            sx={{ mb: 1 }}
            container
            spacing={2}
            key={product.slug + product.size}>
            <Grid item xs={3}>
              <NextLink passHref href={`/product/${product.slug}`} legacyBehavior>
                <Link>
                  <CardActionArea>
                    <CardMedia
                      image={product.image}
                      component='img'
                      sx={{ borderRadius: '5px' }}
                    />
                  </CardActionArea>
                </Link>
              </NextLink>
            </Grid>

            <Grid item xs={7}>
              <Box
                display='flex'
                flexDirection='column'>
                <Typography variant='body1' >{product.title}</Typography>
                <Typography variant='body1' >Talla: <strong>{product.size}</strong> </Typography>

                {
                  editable
                    ? <ItemCounter
                      updateQuantity={(quantity: number) => onNewCartQuantityValue(product as ICartProduct, quantity)}
                      maxValue={10}
                      currentValue={product.quantity} />
                    : <Typography variant='h5'>{product.quantity} {product.quantity > 1 ? 'productos' : 'producto'}</Typography>
                }
              </Box>
            </Grid>

            <Grid
              display='flex'
              alignItems='center'
              flexDirection='column'
              item
              xs={2}>
              <Typography variant='subtitle1'>${product.price}</Typography>

              {editable && (
                <Button
                  onClick={() => removeCartProduct(product as ICartProduct)}
                  variant='text'
                  color='secondary'>
                  Remover
                </Button>
              )}

            </Grid>
          </Grid>
        ))
      }
    </>
  )
}

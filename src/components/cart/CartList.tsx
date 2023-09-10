import { FC } from 'react'
import NextLink from 'next/link'
import {
  Box, Button, CardActionArea,
  CardMedia, Grid, Link, Typography
} from "@mui/material"

import { initialData } from "@/database/products"
import { ItemCounter } from '../ui'

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2]
]

interface Props {
  editable?: boolean
}

export const CartList: FC<Props> = ({ editable = false }) => {
  return (
    <>
      {
        productsInCart.map(product => (
          <Grid
            sx={{ mb: 1 }}
            container
            spacing={2}
            key={product.slug}>
            <Grid item xs={3}>
              {/* TODO: Llevar a la pagina del producto */}
              <NextLink passHref href='/product/slug' legacyBehavior>
                <Link>
                  <CardActionArea>
                    <CardMedia
                      image={`/products/${product.images[0]}`}
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
                <Typography variant='body1' >Talla: <strong>M</strong> </Typography>

                {editable ? <ItemCounter /> : <Typography variant='h5'>3 Items</Typography>}
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
                <Button variant='text' color='secondary'>
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

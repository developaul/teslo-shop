import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { Box, Button, Chip, Grid, Typography } from '@mui/material'

import { ProductSlideshow } from '@/components/products/ProductSlideshow'
import { SizeSelector } from '@/components/products'
import { ShopLayout } from '@/components/layouts'
import { ItemCounter } from '@/components/ui'

import { ICartProduct, IProduct, ISize } from '@/interfaces'

import { CartContext } from '@/context'
import { dbProducts } from '@/database'

interface Props {
  product: IProduct
}

const Slug: NextPage<Props> = ({ product }) => {

  const router = useRouter()

  const { addProductToCart } = useContext(CartContext)

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  })

  const onSelectedSize = (size: ISize) => {
    setTempCartProduct(prev => ({
      ...prev,
      size
    }))
  }

  const updateQuantity = (quantity: number) => {
    setTempCartProduct(prev => ({
      ...prev,
      quantity
    }))
  }

  const onAddProduct = () => {
    if (!tempCartProduct.size) return

    addProductToCart(tempCartProduct)

    router.push('/cart')
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow images={product.images} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column'>
            {/* Titulos */}
            <Typography variant='h1' component='h1'>{product.title}</Typography>
            <Typography variant='subtitle1' component='h2'>${product.price}</Typography>

            {/* Cantidad */}
            <Box sx={{ my: 2 }}>
              <Typography variant='subtitle2'>Cantidad</Typography>
              <ItemCounter
                currentValue={tempCartProduct.quantity}
                updateQuantity={updateQuantity}
                maxValue={product.inStock || 1}
              />
              <SizeSelector
                onSelectedSize={onSelectedSize}
                selectedSize={tempCartProduct.size}
                sizes={product.sizes} />
            </Box>

            {/* Agregar al carrito */}
            {
              (
                product.inStock > 0 ?
                  (
                    <Button
                      onClick={onAddProduct}
                      color='secondary'
                      className='circular-btn'>
                      {tempCartProduct.size ? 'Agregar al carrito' : 'Seleccione una talla'}
                    </Button>
                  ) : (
                    <Chip
                      label='No hay disponibles'
                      color='error'
                      variant='outlined'
                    />
                  )
              )
            }

            {/* Descripcion */}
            <Box sx={{ mt: 3 }}>
              <Typography variant='subtitle2'>Descripcion</Typography>
              <Typography variant='body2'>{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await dbProducts.getAllProductSlugs()

  const paths = slugs.map((slug) => ({ params: { slug } }))

  return {
    paths,
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = '' } = params as { slug: string }

  const product = await dbProducts.getProductBySlug(slug)

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      product
    },
    revalidate: 86_400
  }
}

export default Slug
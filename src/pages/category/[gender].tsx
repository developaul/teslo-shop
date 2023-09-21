import { NextPage } from "next"
import { Typography } from "@mui/material"
import { useRouter } from "next/router"

import { ShopLayout } from "@/components/layouts"
import { ProductList } from "@/components/products"
import { FullScreenLoading } from "@/components/ui"
import { useProducts } from "@/hooks"


const CategoryPage: NextPage = () => {

  const { query } = useRouter()
  const { gender } = query

  const { products, isLoading } = useProducts(`/products?gender=${gender}`)

  return (
    <ShopLayout
      title={`Teslo-Shop - ${gender}`}
      pageDescription={`Encuentra los mejores productos para ${gender} aqui`}
    >
      <Typography variant="h1" component='h1'>Tienda</Typography>
      <Typography variant="h2" sx={{ mb: 1 }} >Todos los Productos</Typography>

      {
        isLoading
          ? <FullScreenLoading />
          : <ProductList products={products} />
      }

    </ShopLayout>
  )
}

export default CategoryPage
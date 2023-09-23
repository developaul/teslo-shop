import { GetServerSideProps, NextPage } from "next"
import { Typography, Box } from "@mui/material"

import { ShopLayout } from "@/components/layouts"
import { ProductList } from "@/components/products"

import { dbProducts } from "@/database"
import { IProduct } from "@/interfaces"


interface Props {
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {

  return (
    <ShopLayout
      title={"Teslo-Shop - Search"}
      pageDescription={"Encuentra los mejores productos de Teslo aqui"}
    >
      <Typography variant="h1" component='h1'>Buscar producto</Typography>

      {
        foundProducts
          ? <Typography variant="h2" sx={{ mb: 1 }} textTransform='capitalize' >Termino: {query}</Typography>
          : <Box display='flex'>
            <Typography variant="h2" sx={{ mb: 1 }} >No encontramos ningun producto: </Typography>
            <Typography variant="h2" sx={{ ml: 1 }} textTransform='capitalize' color='secondary' >{query}</Typography>
          </Box>
      }




      <ProductList products={products} />

    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = '' } = params as { query: string }

  if (query.length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: true
      }
    }
  }

  let products = await dbProducts.getProductsByTerm(query)

  const foundProducts = products.length > 0

  if (!foundProducts) {
    products = await dbProducts.getProductsByTerm('shirts')
  }

  return {
    props: {
      products,
      foundProducts,
      query
    }
  }
}

export default SearchPage
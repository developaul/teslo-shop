import NextLink from 'next/link'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import { AppBar, Badge, Box, Button, IconButton, Link, Toolbar, Typography } from "@mui/material"
import {
  SearchOutlined as SearchOutlinedIcon,
  ShoppingCartOutlined as ShoppingCartOutlinedIcon
} from '@mui/icons-material'

import { UiContext } from '@/context'

export const Navbar = () => {
  const { query: { gender } } = useRouter()

  const { toogleSideMenu } = useContext(UiContext)

  return (
    <AppBar>
      <Toolbar>
        <Link display='flex' alignItems='center' href='/' component={NextLink}>
          <Typography variant='h6'>Teslo |</Typography>
          <Typography sx={{ ml: 0.5 }}>Shop</Typography>
        </Link>

        <Box flex={1} />

        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Link component={NextLink} href='/category/men'>
            <Button color={gender === 'men' ? 'primary' : 'info'} >
              Hombres
            </Button>
          </Link>
          <Link component={NextLink} href='/category/women'>
            <Button color={gender === 'women' ? 'primary' : 'info'} >
              Mujeres
            </Button>
          </Link>
          <Link component={NextLink} href='/category/kid'>
            <Button color={gender === 'kid' ? 'primary' : 'info'} >
              Ninos
            </Button>
          </Link>
        </Box>

        <Box flex={1} />

        <IconButton>
          <SearchOutlinedIcon />
        </IconButton>

        <Link component={NextLink} href='/cart'>
          <IconButton>
            <Badge badgeContent={2} color='secondary'>
              <ShoppingCartOutlinedIcon />
            </Badge>
          </IconButton>
        </Link>

        <Button onClick={toogleSideMenu} >
          Menu
        </Button>
      </Toolbar>
    </AppBar>
  )
}

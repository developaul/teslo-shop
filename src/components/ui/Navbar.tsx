import NextLink from 'next/link'
import { AppBar, Badge, Box, Button, IconButton, Link, Toolbar, Typography } from "@mui/material"
import {
  SearchOutlined as SearchOutlinedIcon,
  ShoppingCartOutlined as ShoppingCartOutlinedIcon
} from '@mui/icons-material'

export const Navbar = () => {
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
            <Button>
              Hombres
            </Button>
          </Link>
          <Link component={NextLink} href='/category/women'>
            <Button>
              Mujeres
            </Button>
          </Link>
          <Link component={NextLink} href='/category/kid'>
            <Button>
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

        <Button>
          Menu
        </Button>
      </Toolbar>
    </AppBar>
  )
}

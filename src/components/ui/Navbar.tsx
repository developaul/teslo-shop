import NextLink from 'next/link'
import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from "@mui/material"
import {
  ClearOutlined as ClearOutlinedIcon,
  SearchOutlined as SearchOutlinedIcon,
  ShoppingCartOutlined as ShoppingCartOutlinedIcon
} from '@mui/icons-material'

import { CartContext, UiContext } from '@/context'

export const Navbar = () => {
  const { query: { gender }, push } = useRouter()

  const { toogleSideMenu } = useContext(UiContext)
  const { orderSummary } = useContext(CartContext)

  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return
    push(`/search/${searchTerm}`)
  }

  return (
    <AppBar>
      <Toolbar>
        <Link display='flex' alignItems='center' href='/' component={NextLink}>
          <Typography variant='h6'>Teslo |</Typography>
          <Typography sx={{ ml: 0.5 }}>Shop</Typography>
        </Link>

        <Box flex={1} />

        <Box sx={{ display: isSearchVisible ? 'none' : { xs: 'none', md: 'block' } }}>
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

        {/* Pantalla grande */}
        {
          isSearchVisible ? (
            <Input
              sx={{ display: { xs: 'none', sm: 'flex' } }}
              className='fadeIn'
              autoFocus
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyUp={e => e.key === 'Enter' ? onSearchTerm() : null}
              type='text'
              placeholder="Buscar..."
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setIsSearchVisible(false)}
                    aria-label="toggle password visibility"
                  >
                    <ClearOutlinedIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          ) : (
            <IconButton
              sx={{ display: { xs: 'none', sm: 'flex' } }}
              className='fadeIn'
              onClick={() => setIsSearchVisible(true)} >
              <SearchOutlinedIcon />
            </IconButton>
          )
        }

        {/* Pantallas small */}
        <IconButton
          sx={{ display: { xs: 'flex', sm: 'none' } }}
          onClick={toogleSideMenu}
        >
          <SearchOutlinedIcon />
        </IconButton>

        <Link component={NextLink} href='/cart'>
          <IconButton>
            <Badge badgeContent={orderSummary.numberOfItems} max={9} color='secondary'>
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

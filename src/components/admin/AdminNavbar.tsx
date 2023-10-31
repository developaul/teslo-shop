import NextLink from 'next/link'
import { useContext } from 'react'
import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material"

import { UiContext } from '@/context'

export const AdminNavbar = () => {

  const { toogleSideMenu } = useContext(UiContext)

  return (
    <AppBar>
      <Toolbar>
        <Link display='flex' alignItems='center' href='/' component={NextLink}>
          <Typography variant='h6'>Teslo |</Typography>
          <Typography sx={{ ml: 0.5 }}>Shop</Typography>
        </Link>

        <Box flex={1} />

        <Button onClick={toogleSideMenu} >
          Menu
        </Button>
      </Toolbar>
    </AppBar>
  )
}

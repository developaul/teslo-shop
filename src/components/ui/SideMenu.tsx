import { useContext } from "react"
import { useRouter } from "next/router"
import {
  Box, Divider, Drawer, IconButton, Input, InputAdornment,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader
} from "@mui/material"
import {
  AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined,
  EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined,
  SearchOutlined, VpnKeyOutlined
} from "@mui/icons-material"

import { UiContext } from "@/context"


export const SideMenu = () => {

  const router = useRouter()

  const { isMenuOpen, toogleSideMenu } = useContext(UiContext)

  const navigateTo = (url: string) => () => {
    router.push(url)

    toogleSideMenu()
  }

  return (
    <Drawer
      open={isMenuOpen}
      onClose={toogleSideMenu}
      anchor='right'
      sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
    >
      <Box sx={{ width: 250, paddingTop: 5 }}>

        <List>

          <ListItem>
            <Input
              type='text'
              placeholder="Buscar..."
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                  >
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          </ListItem>

          <ListItemButton>
            <ListItemIcon>
              <AccountCircleOutlined />
            </ListItemIcon>
            <ListItemText primary={'Perfil'} />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon>
              <ConfirmationNumberOutlined />
            </ListItemIcon>
            <ListItemText primary={'Mis Ordenes'} />
          </ListItemButton>


          <ListItemButton
            onClick={navigateTo('/category/men')}
            sx={{ display: { xs: '', sm: 'none' } }}>
            <ListItemIcon>
              <MaleOutlined />
            </ListItemIcon>
            <ListItemText primary={'Hombres'} />
          </ListItemButton>

          <ListItemButton
            onClick={navigateTo('/category/women')}
            sx={{ display: { xs: '', sm: 'none' } }}>
            <ListItemIcon>
              <FemaleOutlined />
            </ListItemIcon>
            <ListItemText primary={'Mujeres'} />
          </ListItemButton>

          <ListItemButton
            onClick={navigateTo('/category/kid')}
            sx={{ display: { xs: '', sm: 'none' } }}>
            <ListItemIcon>
              <EscalatorWarningOutlined />
            </ListItemIcon>
            <ListItemText primary={'Niños'} />
          </ListItemButton>


          <ListItemButton>
            <ListItemIcon>
              <VpnKeyOutlined />
            </ListItemIcon>
            <ListItemText primary={'Ingresar'} />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon>
              <LoginOutlined />
            </ListItemIcon>
            <ListItemText primary={'Salir'} />
          </ListItemButton>


          {/* Admin */}
          <Divider />
          <ListSubheader>Admin Panel</ListSubheader>

          <ListItemButton>
            <ListItemIcon>
              <CategoryOutlined />
            </ListItemIcon>
            <ListItemText primary={'Productos'} />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <ConfirmationNumberOutlined />
            </ListItemIcon>
            <ListItemText primary={'Ordenes'} />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon>
              <AdminPanelSettings />
            </ListItemIcon>
            <ListItemText primary={'Usuarios'} />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  )
}
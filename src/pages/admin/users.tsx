import { useMemo } from 'react'
import useSWR from 'swr'
import { PeopleOutline } from '@mui/icons-material'
import { Grid, MenuItem, Select } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

import { AdminLayout } from '@/components/layouts'
import { IUser } from '@/interfaces'
import tesloApi from '@/api/tesloApi'




const UsersPage = () => {

  const { data, isLoading, mutate } = useSWR<IUser[]>('/api/admin/users')

  const onUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      await tesloApi.put('/admin/users', { userId, role: newRole })
      await mutate(data!.map(user => user._id === userId ? { ...user, role: newRole } : user));

    } catch (error) {
      console.log(error)
      alert('No se pudo actualizar el rol del usuario')
    }
  }

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre completo', width: 300 },
    {
      field: 'role',
      headerName: 'Rol',
      width: 300,
      renderCell: (({ row }) => {
        return (
          <Select
            value={row.role}
            label='Rol'
            sx={{ width: 300 }}
            onChange={event => onUpdateUserRole(row.id, event.target.value)}
          >

            <MenuItem value='admin'>Admin</MenuItem>
            <MenuItem value='client'>Client</MenuItem>
            <MenuItem value='super-user'>Super User</MenuItem>
            <MenuItem value='SEO'>SEO</MenuItem>
          </Select>
        )
      })
    },
  ]

  const rows = useMemo(() => {
    return (data ?? []).map(({ email, role, name, _id }) => ({
      email,
      role,
      name,
      id: _id
    }))
  }, [data])

  if (isLoading) return <></>

  return (
    <AdminLayout
      title='Usuarios'
      subTitle='Mantenimiento de usuarios'
      icon={<PeopleOutline />}
    >
      <Grid className='fadeIn' container>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            columns={columns}
            rows={rows}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5 }
              },
            }}
            pageSizeOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default UsersPage
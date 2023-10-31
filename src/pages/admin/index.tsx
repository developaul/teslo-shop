import { AdminLayout } from '@/components/layouts'
import { DashboardOutlined } from '@mui/icons-material'
import React from 'react'

const DashBoardPage = () => {
  return (
    <AdminLayout title='Dashboard' subTitle='Estadisticas generales' icon={<DashboardOutlined />}>
      <h3 className="">hello world</h3>
    </AdminLayout>
  )
}

export default DashBoardPage
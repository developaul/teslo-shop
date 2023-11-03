import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { CircularProgress, Grid, Typography } from '@mui/material'
import {
  AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined,
  CategoryOutlined, CreditCardOffOutlined, DashboardOutlined,
  GroupOutlined, ProductionQuantityLimitsOutlined
} from '@mui/icons-material'

import { SummaryTile } from '@/components/admin'
import { AdminLayout } from '@/components/layouts'
import { DashboardInfo } from '@/interfaces'

const DashBoardPage = () => {

  const { data, isLoading, error } = useSWR<DashboardInfo>('/api/admin/dashboard', { refreshInterval: 30 * 1000 })

  const [refreshIn, setRefreshIn] = useState(30)

  useEffect(() => {

    const interval = setInterval(() =>
      setRefreshIn(prev => prev > 0 ? prev - 1 : 30)
      , 1000)

    return () => {
      clearInterval(interval)
    }

  }, [])

  if (isLoading)
    return <CircularProgress />

  if (error) {
    console.log(error)
    return <Typography>Error al cargar informacion</Typography>
  }

  const {
    numberOfOrders, paidOrders, notPaidOrders, numberOfClients,
    numberOfProducts, productsWithNoInventory, lowInventory
  } = data!

  return (
    <AdminLayout title='Dashboard' subTitle='Estadisticas generales' icon={<DashboardOutlined />}>
      <Grid container spacing={2}>
        <SummaryTile title={numberOfOrders} subTitle='Ordenes totales' icon={<CreditCardOffOutlined color='secondary' sx={{ fontSize: 40 }} />} />
        <SummaryTile title={paidOrders} subTitle='Ordenes pagadas' icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />} />
        <SummaryTile title={notPaidOrders} subTitle='Ordenes pendientes' icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} />} />
        <SummaryTile title={numberOfClients} subTitle='Clientes' icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }} />} />
        <SummaryTile title={numberOfProducts} subTitle='Productos' icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />} />
        <SummaryTile title={productsWithNoInventory} subTitle='Sin Existencias' icon={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />} />
        <SummaryTile title={lowInventory} subTitle='Bajo inventario' icon={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} />} />
        <SummaryTile title={refreshIn} subTitle='Actualizacion en:' icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} />} />
      </Grid>
    </AdminLayout>
  )
}

export default DashBoardPage
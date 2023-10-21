import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import {
  Box,
  Button,
  FormControl, Grid, MenuItem,
  TextField, Typography
} from '@mui/material'
import Cookies from 'js-cookie'

import { ShopLayout } from '@/components/layouts'
import { countries, getAddressFromCookies } from '@/utils'
import { CartContext } from '@/context'

export interface FormData {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
}


const AddressPage = () => {

  const router = useRouter()

  const { updateShippingAddress } = useContext(CartContext)

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm<FormData>({ defaultValues: {
    firstName: '',
    lastName: '',
    address: '',
    address2: '',
    zip: '',
    city: '',
    country: countries[0].code,
    phone: '',
  } })

  useEffect(() => {
    reset(getAddressFromCookies())
  }, [reset])

  const onSubmitAddress = (data: FormData) => {
    updateShippingAddress(data)

    router.push('/checkout/summary')
  }

  return (
    <ShopLayout
      title='Direccion'
      pageDescription='Confirmar direccion del destino'>
      <Typography variant='h1' component='h1'>Direccion</Typography>

      <form onSubmit={handleSubmit(onSubmitAddress)} noValidate>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField {...register('firstName', { required: 'El nombre es obligatorio' })} helperText={errors.firstName?.message} error={Boolean(errors.firstName)} label='Nombre' variant='filled' fullWidth />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField {...register('lastName', { required: 'El apellido es obligatorio' })} helperText={errors.lastName?.message} error={Boolean(errors.lastName)} label='Apellido' variant='filled' fullWidth />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField {...register('address', { required: 'La direccion es obligatoria' })} helperText={errors.address?.message} error={Boolean(errors.address)} label='Direccion' variant='filled' fullWidth />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField {...register('address2')} label='Direccion 2 (opcional)' variant='filled' fullWidth />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField {...register('zip', { required: 'El codigo postal es obligatorio' })} helperText={errors.zip?.message} error={Boolean(errors.zip)} label='Codigo Postal' variant='filled' fullWidth />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField {...register('city', { required: 'La ciudad obligatoria' })} helperText={errors.city?.message} error={Boolean(errors.city)} label='Ciudad' variant='filled' fullWidth />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth >
              <TextField
                select
                {...register('country', { required: 'El pais es obligatorio' })}
                defaultValue={Cookies.get('country') ?? countries[0].code}
                error={Boolean(errors.country)}
                helperText={errors.country?.message}
                variant='filled'
                label='Pais'
              >
                {countries.map((country) => <MenuItem key={country.code} value={country.code}>{country.name}</MenuItem>)}
              </TextField>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              {...register('phone', { required: 'El telefono obligatoria' })}
              helperText={errors.phone?.message} error={Boolean(errors.phone)}
              label='Telefono'
              variant='filled'
              fullWidth />
          </Grid>
        </Grid>
        <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
          <Button
            type='submit'
            size='large'
            className='circular-btn'
            color='secondary'>
            Revisar pedido
          </Button>
        </Box>
      </form>
    </ShopLayout>
  )
}

export default AddressPage
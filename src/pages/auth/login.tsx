import NextLink from 'next/link'
import { useForm } from 'react-hook-form'
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material'
import { ErrorOutline } from '@mui/icons-material'

import tesloApi from '@/api/tesloApi'

import { AuthLayout } from '@/components/layouts'
import { validations } from '@/utils'
import { useState } from 'react'

type FormData = {
  email: string
  password: string
}

const LoginPage = () => {

  const [showError, setShowError] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false)

    try {
      const { data } = await tesloApi.post('/user/login', { email, password })
      const { token, user } = data

      console.log("🚀 ~ file: login.tsx:25 ~ onLoginUser ~ data:", { token, user })

      // Redireccionar a la pantalla anterior

    } catch (error) {
      console.log('Error en las credenciales')
      setShowError(true)
      setTimeout(() => setShowError(false), 3000);
    }
  }

  return (
    <AuthLayout title='Ingresar'>
      <form onSubmit={handleSubmit(onLoginUser)} noValidate >
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h1' component='h1' >Iniciar sesion</Typography>
              <Chip
                label={'No reconocemos ese usuario / password'}
                color='error'
                icon={<ErrorOutline />}
                className='fadeIn'
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type='email'
                label='Correo'
                variant='filled'
                fullWidth
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                {...register(
                  'email',
                  {
                    required: 'El correo es obligatorio',
                    validate: validations.isEmail
                  }
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Password'
                type='password'
                variant='filled'
                fullWidth
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                {...register(
                  'password',
                  {
                    required: 'El password es obligatorio',
                    minLength: { value: 6, message: 'Minimo 6 caracteres' },
                  }
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type='submit'
                className='circular-btn'
                size='large'
                color='secondary'
                fullWidth >
                Ingresar
              </Button>
            </Grid>

            <Grid item xs={12} display='flex' justifyContent='end'>
              <NextLink href='/auth/register' passHref legacyBehavior>
                <Link underline='always'>
                  No tienes cuenta?
                </Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
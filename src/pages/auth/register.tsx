import { useState } from 'react'
import NextLink from 'next/link'
import { useForm } from 'react-hook-form'
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material'
import { ErrorOutline } from '@mui/icons-material'

import { AuthLayout } from '@/components/layouts'
import tesloApi from '@/api/tesloApi'
import { validations } from '@/utils'

type FormData = {
  name: string
  email: string
  password: string
}

const RegisterPage = () => {

  const [showError, setShowError] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onRegisterForm = async ({ name, email, password }: FormData) => {
    setShowError(false)

    try {
      const { data } = await tesloApi.post('/user/register', { name, email, password })
      const { token, user } = data

      console.log("🚀 ~ file: login.tsx:25 ~ onRegisterForm ~ data:", { token, user })

      // Redireccionar a la pantalla anterior

    } catch (error) {
      console.log('Error en las credenciales')
      setShowError(true)
      setTimeout(() => setShowError(false), 3000);
    }
  }

  return (
    <AuthLayout title='Ingresar'>
      <form onSubmit={handleSubmit(onRegisterForm)} noValidate >
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h1' component='h1'>Crear cuenta</Typography>
              <Chip
                label={'No se pudo registrar al usuario'}
                color='error'
                icon={<ErrorOutline />}
                className='fadeIn'
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Nombre Completo'
                variant='filled'
                fullWidth
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
                {...register(
                  'name',
                  {
                    required: 'El nombre es obligatorio',
                    minLength: { value: 2, message: 'Minimo 2 caracteres' },
                  }
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Correo'
                variant='filled'
                fullWidth
                type='email'
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
                Registrarse
              </Button>
            </Grid>

            <Grid item xs={12} display='flex' justifyContent='end'>
              <NextLink href='/auth/login' passHref legacyBehavior>
                <Link underline='always'>
                  Ya tienes cuenta?
                </Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}

export default RegisterPage
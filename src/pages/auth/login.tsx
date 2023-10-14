import NextLink from 'next/link'
import { useContext, useState } from 'react'
import { GetServerSideProps } from 'next'
import { useForm } from 'react-hook-form'
import { getSession, signIn } from 'next-auth/react'
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material'
import { ErrorOutline } from '@mui/icons-material'

import { AuthLayout } from '@/components/layouts'
import { validations } from '@/utils'
import { AuthContext } from '@/context'
import { useRouter } from 'next/router'

type FormData = {
  email: string
  password: string
}

const LoginPage = () => {
  const router = useRouter()

  const [showError, setShowError] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false)

    await signIn('credentials', { email, password })
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
              <NextLink href={{ pathname: '/auth/register', query: router.query }} passHref legacyBehavior>
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

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

  const session = await getSession({ req })

  const { p = '/' } = query

  if (session) {
    return { redirect: { destination: p.toString(), permanent: false } }
  }

  return { props: {} }
}

export default LoginPage
import NextLink from 'next/link'
import { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { getSession, signIn, getProviders } from 'next-auth/react'
import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from '@mui/material'
import { ErrorOutline } from '@mui/icons-material'

import { AuthLayout } from '@/components/layouts'
import { validations } from '@/utils'

type FormData = {
  email: string
  password: string
}

const LoginPage = () => {
  const router = useRouter()

  const [showError, setShowError] = useState(false)

  const [providers, setProviders] = useState<any>({})

  useEffect(() => {

    getProviders()
      .then((prov) => {
        setProviders(prov ?? {})
      })

  }, [])

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

            <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
              <Divider sx={{ width: '100%', mb: 2 }} />

              {
                Object.values(providers)
                  .filter(({ id }: any) => id !== "credentials")
                  .map((provider: any) => {

                    return (
                      <Button
                        key={provider.id}
                        variant='outlined'
                        fullWidth
                        onClick={() => signIn(provider.id)}
                        color='primary'
                        sx={{ mb: 1 }}
                      >
                        {provider.name}
                      </Button>
                    )
                  })
              }


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
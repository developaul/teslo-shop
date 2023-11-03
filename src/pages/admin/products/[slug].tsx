import React, { FC, useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { useForm } from 'react-hook-form';
import {
  Box, Button, capitalize, Card, CardActions, CardMedia,
  Checkbox, Chip, Divider, FormControl, FormControlLabel,
  FormGroup, FormLabel, Grid, Radio,
  RadioGroup, TextField
} from '@mui/material';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';

import { AdminLayout } from '@/components/layouts';
import { dbProducts } from '@/database';

import { IProduct, IType } from '@/interfaces';
import tesloApi from '@/api/tesloApi';
import { useRouter } from 'next/router';


const validTypes = ['shirts', 'pants', 'hoodies', 'hats']
const validGender = ['men', 'women', 'kid', 'unisex']
const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

interface FormData {
  _id?: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: string[];
  slug: string;
  tags: string[];
  title: string;
  type: IType;
  gender: string;
}

interface Props {
  product: IProduct;
}

const ProductAdminPage: FC<Props> = ({ product }) => {

  const router = useRouter()

  const [newTagValue, setNewTagValue] = useState('')

  const {
    register, handleSubmit, formState: { errors, isSubmitting },
    getValues, setValue, watch
  } = useForm<FormData>({
    defaultValues: product,
  })
  console.log("🚀 ~ file: [slug].tsx:47 ~ isSubmitting:", isSubmitting)

  useEffect(() => {

    const subscription = watch((value, { name, type }) => {
      if (name === 'title') {
        const newSlug = value.title?.trim()
          .replaceAll(' ', '_')
          .replaceAll("'", '')
          .toLocaleLowerCase() ?? ''

        setValue('slug', newSlug)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [watch, setValue])

  const onChangeSize = (size: string) => {
    const currentSizes = getValues('sizes')

    if (currentSizes.includes(size)) {
      setValue('sizes', currentSizes.filter(s => s !== size), { shouldValidate: true })
      return
    }

    setValue('sizes', [...currentSizes, size], { shouldValidate: true })
  }

  const onAddNextTag = (event: any): void => {
    if (event.code !== 'Space') return

    setNewTagValue('')
    const newTag = event.target.value

    const tags = getValues('tags')

    if (tags.includes(newTag)) {
      return
    }

    setValue('tags', [...tags, newTag], { shouldValidate: true })
  }

  const onDeleteTag = (tag: string) => {
    const tags = getValues('tags')

    setValue('tags', tags.filter(_tag => _tag !== tag), { shouldValidate: true })

  }

  const onSubmit = async (formData: FormData) => {

    if (formData.images.length < 2) return alert('Minimo 2 imagenes')

    try {
      const { data } = await tesloApi({
        url: '/admin/products',
        method: 'PUT',
        data: formData
      })

      if (!formData._id) router.reload()

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AdminLayout
      title={'Producto'}
      subTitle={`Editando: ${product.title}`}
      icon={<DriveFileRenameOutline />}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
          <Button
            color="secondary"
            startIcon={<SaveOutlined />}
            sx={{ width: '150px' }}
            type="submit"
            disabled={isSubmitting}
          >
            Guardar
          </Button>
        </Box>

        <Grid container spacing={2}>
          {/* Data */}
          <Grid item xs={12} sm={6}>

            <TextField
              label="Título"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register('title', {
                required: 'Este campo es requerido',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },

              })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <TextField
              label="Descripción"
              variant="filled"
              fullWidth
              multiline
              sx={{ mb: 1 }}
              {...register('description', {
                required: 'Este campo es requerido'
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            <TextField
              label="Inventario"
              type='number'
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register('inStock', {
                required: 'Este campo es requerido',
                min: { value: 0, message: 'Mínimo de valor 0' },

              })}
              error={!!errors.inStock}
              helperText={errors.inStock?.message}
            />

            <TextField
              label="Precio"
              type='number'
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register('price', {
                required: 'Este campo es requerido',
                min: { value: 0, message: 'Mínimo de valor 0' },

              })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />

            <Divider sx={{ my: 1 }} />

            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Tipo</FormLabel>


              <RadioGroup
                row
                value={getValues('type')}
                onChange={({ target }) => setValue('type', target.value as IType, { shouldValidate: true })}
              >
                {
                  validTypes.map(option => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio color='secondary' />}
                      label={capitalize(option)}
                    />
                  ))
                }
              </RadioGroup>
            </FormControl>

            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Género</FormLabel>
              <RadioGroup
                row
                value={getValues('gender')}
                onChange={({ target }) => setValue('gender', target.value, { shouldValidate: true })}

              >
                {
                  validGender.map(option => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio color='secondary' />}
                      label={capitalize(option)}
                    />
                  ))
                }
              </RadioGroup>
            </FormControl>

            <FormGroup>
              <FormLabel>Tallas</FormLabel>
              {
                validSizes.map(size => (
                  <FormControlLabel
                    key={size}
                    onChange={() => onChangeSize(size)}
                    control={<Checkbox checked={getValues('sizes').includes(size)} />}
                    label={size} />
                ))
              }
            </FormGroup>

          </Grid>

          {/* Tags e imagenes */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Slug - URL"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register('slug', {
                required: 'Este campo es requerido',
                validate: (value) => value.trim().includes(' ') ? 'No puede tener espacios en blanco' : undefined
              })}
              error={!!errors.slug}
              helperText={errors.slug?.message}
            />

            <TextField
              label="Etiquetas"
              variant="filled"
              fullWidth
              onChange={({ target }) => setNewTagValue(target.value)}
              onKeyUp={onAddNextTag}
              value={newTagValue}
              sx={{ mb: 1 }}
              helperText="Presiona [spacebar] para agregar"
            />

            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              listStyle: 'none',
              p: 0,
              m: 0,
            }}
              component="ul">
              {
                getValues('tags').map((tag) => {

                  return (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => onDeleteTag(tag)}
                      color="primary"
                      size='small'
                      sx={{ ml: 1, mt: 1 }}
                    />
                  );
                })}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display='flex' flexDirection="column">
              <FormLabel sx={{ mb: 1 }}>Imágenes</FormLabel>
              <Button
                color="secondary"
                fullWidth
                startIcon={<UploadOutlined />}
                sx={{ mb: 3 }}
              >
                Cargar imagen
              </Button>

              <Chip
                label="Es necesario al 2 imagenes"
                color='error'
                variant='outlined'
              />

              <Grid container spacing={2}>
                {
                  product.images.map(img => (
                    <Grid item xs={4} sm={3} key={img}>
                      <Card>
                        <CardMedia
                          component='img'
                          className='fadeIn'
                          image={`/products/${img}`}
                          alt={img}
                        />
                        <CardActions>
                          <Button fullWidth color="error">
                            Borrar
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                }
              </Grid>

            </Box>

          </Grid>

        </Grid>
      </form>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { slug = '' } = query;

  const product = await dbProducts.getProductBySlug(slug.toString());

  if (!product) {
    return {
      redirect: {
        destination: '/admin/products',
        permanent: false,
      }
    }
  }

  return {
    props: {
      product
    }
  }
}


export default ProductAdminPage
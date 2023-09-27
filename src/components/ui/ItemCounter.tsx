import { FC } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'

interface Props {
  currentValue: number
  updateQuantity: (quantity: number) => void
  maxValue: number
}

export const ItemCounter: FC<Props> = ({ currentValue, maxValue, updateQuantity }) => {

  const decreaseQuantity = () => {
    const newQuantity = Math.max(1, currentValue - 1)
    updateQuantity(newQuantity)
  }

  const increaseQuantity = () => {
    const newQuantity = Math.min(maxValue, currentValue + 1)
    updateQuantity(newQuantity)
  }

  return (
    <Box
      display='flex'
      alignItems='center'
    >
      <IconButton onClick={decreaseQuantity} >
        <RemoveCircleOutline />
      </IconButton>

      <Typography sx={{ width: 40, textAlign: 'center' }}>{currentValue}</Typography>

      <IconButton onClick={increaseQuantity} >
        <AddCircleOutline />
      </IconButton>
    </Box>
  )
}

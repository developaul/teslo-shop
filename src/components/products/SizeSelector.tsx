import { FC } from 'react'

import { ISize } from '@/interfaces';
import { Box, Button } from '@mui/material';

interface Props {
  selectedSize?: ISize;
  sizes: ISize[],
  onSelectedSize: (size: ISize) => void
}

export const SizeSelector: FC<Props> = ({ selectedSize, sizes, onSelectedSize }) => {

  return (
    <Box>
      {
        sizes.map((size) => (
          <Button
            key={size}
            size='small'
            onClick={() => onSelectedSize(size)}
            color={selectedSize === size ? 'primary' : 'info'}
          >
            {size}
          </Button>
        ))
      }
    </Box>
  )
}

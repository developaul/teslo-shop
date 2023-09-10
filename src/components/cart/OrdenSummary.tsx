import { Grid, Typography } from "@mui/material"

export const OrdenSummary = () => {



  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid
        display='flex'
        justifyContent='end'
        item
        xs={6}>
        <Typography>3</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>SubTotal</Typography>
      </Grid>
      <Grid
        display='flex'
        justifyContent='end'
        item
        xs={6}>
        <Typography>${155.36}</Typography>
      </Grid>


      <Grid item xs={6}>
        <Typography>Impuestos (15%)</Typography>
      </Grid>
      <Grid
        display='flex'
        justifyContent='end'
        item
        xs={6}>
        <Typography>${35.34}</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Total: </Typography>
      </Grid>
      <Grid
        sx={{ mt: 2 }}
        display='flex'
        justifyContent='end'
        item
        xs={6}>
        <Typography
          variant="subtitle1"
        >${186.34}</Typography>
      </Grid>
    </Grid>
  )
}

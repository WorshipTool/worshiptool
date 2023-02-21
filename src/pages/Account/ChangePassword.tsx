import { Box, Typography } from '@mui/material'
import React from 'react'

export default function ChangePassword() {
  return (
    <Box display={"flex"} flexDirection={"column"}>
        <Typography variant="caption">Informace uživatele zatím nelze změnit.</Typography>
        <Typography variant="caption">Na této funkcionalitě se zatím stále pracuje...</Typography>
    </Box>
  )
}

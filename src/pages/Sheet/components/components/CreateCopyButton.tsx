import { Cyclone, DonutLarge, EggAlt } from '@mui/icons-material'
import { Button } from '@mui/material'
import React from 'react'

export default function CreateCopyButton() {
  return (
    <Button color='success' variant='outlined' 
        startIcon={<EggAlt/>}>
        Vytvořit kopii
    </Button>
  )
}

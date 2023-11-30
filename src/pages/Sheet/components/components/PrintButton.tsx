import { Print } from '@mui/icons-material'
import { Button } from '@mui/material'
import React from 'react'

interface PrintButtonProps {
}

export default function PrintButton(props: PrintButtonProps) {
    const onPrintClick = () => {
        window.print();

    }
    return (
        <div>
            <Button 
                endIcon={<Print/>} 
                variant="outlined" 
                color="primary" 
                onClick={onPrintClick}>
                    Tisknout
                </Button>
        </div>
    )
}

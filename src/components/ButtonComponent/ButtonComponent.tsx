import { Box, styled } from '@mui/material'
import React from 'react'

const Container = styled(Box)(({theme})=>({
    transition: "all 0.2s ease",
    '&:hover': {
        filter: "drop-shadow(4px 4px 4px #00000022)",
        transform: "scale(102%)"
    },
    '&:active': {
        transform: "scale(98%)"
    },
    cursor: "default",
    userSelect: "none",
    pointerEvents: "auto"

}))


interface ButtonComponentProps extends React.HTMLAttributes<HTMLDivElement>{
    children?: React.ReactNode
}


export default function ButtonComponent(props:ButtonComponentProps) {
  return (
    <Container {...props}>
        {props.children}
    </Container>
  )
}

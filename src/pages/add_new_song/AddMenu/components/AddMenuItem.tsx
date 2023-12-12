import { Box, Paper, Typography } from '@mui/material'
import React from 'react'
import Gap from '../../../../components/Gap';

interface AddMenuItemProps {
    title?: string,
    onClick?: ()=>void,
    icon?: React.ReactNode,
    iconSize?: number,
    disabled?: boolean,
    subtitle?: React.ReactNode
}

export default function AddMenuItem(props: AddMenuItemProps) {
    const size = 200;
  
    return (
    <div onClick={()=>{
        if(props.disabled) return;
        props?.onClick?.()

    }}>
        <Paper sx={{
            width: size,
            height: size,
            "&:hover": props.disabled ? {} : {
                backgroundColor: "rgba(255,255,255,0.4)",
                transform: "scale(1.02)"
            },
            transition: "all 0.2s ease-in-out",
            opacity: props.disabled ? 0.5 : 1,
        }}>
            <Box sx={{
                width: "100%",
                height: "100%",
                display:"flex",
                flexDirection:"column",
                alignItems:"center",
                justifyContent:"center",

            }}>
                <Box sx={{
                    fontSize: props.iconSize || 60,
                    display:"flex",
                    flexDirection:"column",
                    justifyContent:"center",
                    alignItems:"center",
                    height: 60
                }}>
                    {props.icon}
                </Box>
        
                <Gap value={1}/>
                <Typography variant='h6' sx={{
                    textAlign:"center",
                    userSelect:"none",
                }}>{props.title}</Typography>
                {/* <Gap value={1}/> */}
                <Typography variant="body2" sx={{
                    textAlign:"center",
                    userSelect:"none",
                    paddingX: 2
                }}>{props.subtitle}</Typography>
            </Box>
        </Paper>
    </div>
  )
}

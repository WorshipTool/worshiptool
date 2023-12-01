import React from 'react'
import { SheetStyleComponentType } from './config'
import { Typography } from '@mui/material';



const ExperimentalStyle : SheetStyleComponentType = (props) => {
  return (
    <div>
        {props.title && <Typography variant='h4'>{props.title}</Typography>}
        
        {props.sheet.getSections().map((section, index)=>{
            return <Typography>
                {section.text}
            </Typography>
        })}
        
    </div>
  )
}

export default ExperimentalStyle;

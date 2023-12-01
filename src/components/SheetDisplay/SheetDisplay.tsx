import React from 'react'
import { SheetStyle, sheetStyles } from './styles/config'
import { Sheet } from '@pepavlin/sheet-api'
import { Typography } from '@mui/material'
import EditSheet from './components/EditSheet'

interface SheetDisplayProps {
    // Type of variant is keys of sheetStyles
    variant?: SheetStyle,
    sheet: Sheet,
    title: string,
    editMode?: boolean,
    onChange?: (sheetData: string, title: string)=>void
}



export default function SheetDisplay(props: SheetDisplayProps) {

  return (
    <div>
        {props.editMode? <>
            <EditSheet sheet={props.sheet} title={props.title} onChange={(data, title)=>{
                props.onChange?.(data, title);
            }}/>
        </>:<>
            {sheetStyles[props.variant || "default"]({sheet: props.sheet, title: props.title})}
        </>}

    </div>
  )
}

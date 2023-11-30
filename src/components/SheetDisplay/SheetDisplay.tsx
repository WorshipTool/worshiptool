import React from 'react'
import { SheetStyle, sheetStyles } from './styles/config'
import { Sheet } from '@pepavlin/sheet-api'

interface SheetDisplayProps {
    // Type of variant is keys of sheetStyles
    variant?: SheetStyle,
    sheet: Sheet,
    title?: string
}



export default function SheetDisplay(props: SheetDisplayProps) {

  return (
    <div>
        {sheetStyles[props.variant || "default"]({sheet: props.sheet, title: props.title})}
    </div>
  )
}

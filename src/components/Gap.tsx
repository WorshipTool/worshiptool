import React from 'react'

interface GapProps{
  value?: number,
  vertical?: boolean
}

export default function Gap({value, vertical}:GapProps) {
  return (
    <div style={{
        height:!vertical?(value?value*10:10):0,
        width:vertical?(value?value*10:10):0
    }}>
        
    </div>
  )
}

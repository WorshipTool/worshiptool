import React from 'react'

interface GapProps{
  value?: number
}

export default function Gap({value}:GapProps) {
  return (
    <div style={{
        height:value?value*10:10
    }}>
        
    </div>
  )
}

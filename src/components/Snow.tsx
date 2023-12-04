import React from 'react'
import Snowfall from 'react-snowfall'

export default function Snow() {
  return (
    <Snowfall 
        snowflakeCount={70}
        color="#0085FF44"
        style={{
            zIndex:-100,
        }}
        />
  )
}

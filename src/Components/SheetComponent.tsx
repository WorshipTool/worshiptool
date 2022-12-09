import { Box, listItemSecondaryActionClasses, Stack, Typography } from '@mui/material';
import React, { useState } from 'react'
import Song from '../database/Song';
import LightStyle from "../SheetStyles/LightStyle"
import ModernStyle from "../SheetStyles/ModernStyle"
import ExperimentalStyle from "../SheetStyles/ExperimentalStyle"
import HandWritingStyle from "../SheetStyles/HandWritingStyle"

export interface Segment {
  chord?: string,
  text?: string
}
export interface Line {
  segments: Segment[]
}
export interface Section {
  name?: string,
  lines?: Line[]
}

export function convertSheetToSections(sheet: string) : Section[]{
  let isOk = true;
  const sections: Section[] = sheet.split("{").filter((partA, ia)=>{
    if(ia==0&&partA==="")return 0;
    return 1;
  }).map((partA, ia) => {

    const arrA: string[] = partA.split("}");
    
    if (ia==0&&arrA.length<2){ //situation when it doesnt begin with {
      arrA.splice(0, 0, "");
    }

    
    if (ia!=0&&arrA.length < 2) {
      isOk = false;
      return {};
    }

    const name = arrA[0];
    const lines: Line[] = arrA[1]
    .split("\n")
    .map((partB) => {

      const segments: Segment[] = partB.split("[").map((partC, ib) => {
        const arrC = partC.split("]");

        if(ib==0){
          return { text: arrC[0].replaceAll(' ', '\u00A0') };
        }else{
          if (ib!=0&&arrC.length < 2) {
            isOk = false;
            return {};
          }
        }
        return { chord: arrC[0], text: arrC[1].replaceAll(' ', '\u00A0')};
      })

      return { segments: segments };
    })


    return { name: name, lines: lines }
  })

  return sections;
}

export default function SheetComponent({ song, variant}: { song?: Song, variant?: number }) {

  if(song===undefined){
    return (
      <Typography>Song not set.</Typography>
    )
  }
  if(song.variants.length<1){
    return(
      <Typography>No variants.</Typography>
    )
  }
  if(variant===undefined){
    return (
      <Typography>Variant number is not set.</Typography>
    )
  }
  

  const sections = convertSheetToSections(song.variants[variant].sheet);
  return LightStyle(song, sections);
}


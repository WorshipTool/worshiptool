import { Box, listItemSecondaryActionClasses, Stack, Typography } from '@mui/material';
import React, { useState } from 'react'
import Song from '../database/Song';

interface Segment {
  chord?: string,
  text?: string
}
interface Line {
  segments: Segment[]
}
interface Section {
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


  return (
    <Box>
      <Box display={"flex"} flexDirection={"row"} marginBottom={"1"} gap={1}>
            <Box flex={1}></Box>
            <Box flex={5}>
              <Typography variant='h5'><b>{song.name}</b></Typography>
              {song.creators.map((creator)=>{
                return(
                  <Typography variant='subtitle2'><>{creator.type}</>: {creator.name}</Typography>      
                )
              })}
              
            </Box>
      </Box>
      {sections.map((section: Section) => {
        return (
          <Box display={"flex"} flexDirection={"row"} gap={1} marginBottom={3}>
            <Box flex={1}>
              <Typography variant={"subtitle2"} marginTop={"1.5rem"} textAlign={"end"}>{section.name}{section.name==""?"":":"}</Typography>
            </Box>
            <Box flex={5}>
                {section.lines&&section.lines.map((line)=>{
                  return (
                    <Box display={"flex"} flexDirection={"row"}>
                      {line.segments.map((segment)=>{
                          return(
                            <Box display={"flex"} flexDirection={"column"}>
                              <Box sx={{flex:1}}>
                                {segment.chord&&<Typography sx={{paddingRight: 1}}><b>{segment.chord}</b></Typography>}
                              </Box>
                              
                              <Typography sx={{flex:1}}>{segment.text}</Typography>
                            </Box>
                          )
                      })}
                    </Box>
                  )
                })}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}


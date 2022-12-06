import { Box, listItemSecondaryActionClasses, Stack, Typography } from '@mui/material';
import React from 'react'
import Song from '../database/song'

export default function SheetComponent({ song }: { song: Song }) {

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

  let isOk = true;
  const sections: Section[] = song.sheetData.split("{").map((partA, ia) => {

    if (partA === "") return { name: "" }

    const arrA: string[] = partA.split("}");
    if (ia!=0&&arrA.length < 2) {
      isOk = false;
      return {};
    }

    const name = arrA[0];
    const lines: Line[] = arrA[1].split("\n").map((partB) => {

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

  console.log(sections);

  if (!isOk) {
    return (
      <Typography>Something is wrong in the song.</Typography>
    )
  }



  return (
    <Box>
      <Box display={"flex"} flexDirection={"row"} gap={1} marginBottom={"1"}>
            <Box flex={1}></Box>
            <Box flex={5}>
              <Typography variant='h5'><b>{song.name}</b></Typography>    
            </Box>
      </Box>
      {sections.map((section: Section) => {
        return (
          <Box display={"flex"} flexDirection={"row"} gap={1}>
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


import { Box, Typography } from "@mui/material"
import React from "react"
import {Section} from "../Components/SheetComponent"
import Song from "../database/Song"

export default function HandWritingStyle(song:Song, sections: Section[]){
    
    const font = "Caveat";

    return (
        <Box fontFamily={font}>
            <Box display={"flex"} flexDirection={"row"} gap={1} sx={{marginBottom:1}}>
                    <Box flex={1}></Box>
                    <Box flex={5}>
                    <Typography variant='h5' fontFamily={"inherit"}><b>{song.name}</b></Typography>
                    {song.creators.map((creator)=>{
                        return(
                        <Typography variant='subtitle2' fontFamily={"inherit"}><>{creator.type}</>: {creator.name}</Typography>      
                        )
                    })}
                    
                    </Box>
            </Box>
            {sections.map((section: Section) => {
                return (
                <Box display={"flex"} flexDirection={"row"} gap={1} marginBottom={3}>
                    <Box flex={1}>
                    <Typography variant={"subtitle2"} marginTop={"1.5rem"} textAlign={"end"} fontFamily={"inherit"}>{section.name}{section.name==""?"":":"}</Typography>
                    </Box>
                    <Box flex={5}>
                        {section.lines&&section.lines.map((line)=>{
                        return (
                            <Box display={"flex"} flexDirection={"row"}>
                            {line.segments.map((segment)=>{
                                return(
                                    <Box display={"flex"} flexDirection={"column"}>
                                    <Box sx={{flex:1}}>
                                        {segment.chord&&<Typography sx={{paddingRight: 1}} fontFamily={"inherit"}>{segment.chord}</Typography>}
                                    </Box>
                                    
                                    <Typography sx={{flex:1}} fontFamily={"inherit"} fontWeight={"bold"}>{segment.text}</Typography>
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
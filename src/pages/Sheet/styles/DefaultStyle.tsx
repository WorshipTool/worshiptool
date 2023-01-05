import { Box, Typography } from "@mui/material";
import songObject, { section } from "../../../models/song";
import React from 'react'

export default function DefaultStyle({song}:{song:songObject}){

    const sections = song.variants[0].sections;
    
    const font = "Roboto";

    const width = "2rem"

    return (
        <Box fontFamily={font}>
            <Box display={"flex"} flexDirection={"row"} gap={1} sx={{marginBottom:1}}>
                    <Box width={width}></Box>
                    <Box flex={10}>
                    <Typography variant='h5' fontFamily={"inherit"}><b>{song.title}</b></Typography>
                    {song.creators.map((creator)=>{
                        return(
                        <Typography variant='subtitle2' fontFamily={"inherit"}><>{creator.type}</>: {creator.name}</Typography>      
                        )
                    })}
                    
                    </Box>
            </Box>
            {sections.map((section: section, index) => {
                return (
                <Box display={"flex"} flexDirection={"row"} gap={1} marginBottom={3} key={"abox"+index}>
                    <Box width={width}>
                        <Typography variant={"subtitle2"} marginTop={"1.5rem"} textAlign={"end"} fontFamily={"inherit"}>{section.name}{section.name==""?"":":"}</Typography>
                    </Box>
                    <Box flex={10}>
                        {section.lines&&section.lines.map((line, index)=>{
                        return (
                            <Box display={"flex"} flexDirection={"row"}  key={"bbox"+index}>
                            {line.segments.map((segment, index)=>{
                                return(
                                    <Box display={"flex"} flexDirection={"column"}  key={"cbox"+index}>
                                        <Box sx={{flex:1}}>
                                            {segment.chord&&<Typography sx={{paddingRight: 1}} fontFamily={"inherit"}><b>{segment.chord}</b></Typography>}
                                        </Box>
                                        
                                        <Typography sx={{flex:1}} fontFamily={"inherit"}>{segment.text}</Typography>
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
import { Box, Typography } from "@mui/material"
import { alpha, styled } from "@mui/material/styles";
import React from "react"
import {Section} from "../Components/SheetComponent"
import Song from "../database/Song"

export default function ModernStyle(song:Song, sections: Section[]){
    
    const font = "Kanit";

    const StyledDivider = styled(Box)(({theme})=>({
        width: 1,
        backgroundColor: alpha(theme.palette.common.black,0.5),
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 5
    }))

        const gap = 0.8;
    return (
        <Box fontFamily={font}>
            <Box display={"flex"} flexDirection={"row"} gap={gap} sx={{marginBottom:1}}>
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
            {sections.map((section: Section, sectionIndex: number) => {
                return (
                <Box display={"flex"} flexDirection={"row"} gap={gap} marginTop={sectionIndex==0?0: 3 }>
                    <Box flex={1} paddingTop={"1.5rem"} display={"flex"} flexDirection={"row"} justifyContent={"end"}>
                        <Typography variant={"subtitle2"} textAlign={"end"} fontFamily={"inherit"} marginRight={2}>{section.name}{section.name==""?"":":"}</Typography>
                        <StyledDivider></StyledDivider>
                    </Box>
                    <Box flex={5}>
                        {section.lines&&section.lines.map((line)=>{
                        return (
                            <Box display={"flex"} flexDirection={"row"}>
                            {line.segments.map((segment)=>{
                                return(
                                    <Box display={"flex"} flexDirection={"column"}>
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
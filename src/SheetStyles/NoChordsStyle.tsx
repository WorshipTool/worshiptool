import { Box, Typography } from "@mui/material"
import { alpha, styled } from "@mui/material/styles";
import React from "react"
import {Section} from "../Components/SheetComponent"
import Song from "../Data/Song/Song"

export default function NoChordStyle(song:Song, sections: Section[]){
    
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
            {sections.map((section: Section, sectionIndex: number) => {
                return (
                <Box gap={gap} marginTop={sectionIndex==0?0: 3 }>
                    {section.lines&&section.lines.map((line)=>{
                        return (
                            <Typography sx={{flex:1}} fontFamily={"inherit"}>
                            {
                            line.segments.map((segment)=>{
                                return(
                                    
                                    segment.text?.replaceAll('\u00A0', " ")
                                )
                            }).join("")
                            }
                            </Typography>
                        )
                        })}
                </Box>
                )
            })}
        </Box>
    )
}
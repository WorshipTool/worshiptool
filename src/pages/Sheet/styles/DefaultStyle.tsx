import { Box, Typography } from "@mui/material";
import songObject from "../../../interfaces/song/song";
import React, { useMemo } from 'react'
import { VariantDTO } from "../../../interfaces/variant/VariantDTO";
import { Chord, Sheet } from "@pepavlin/sheet-api";

interface DefaultStyleProps{
    variantData?: VariantDTO,
    title? :string,
    sheet: Sheet
}

export default function DefaultStyle({variantData, sheet, title: titleString}:DefaultStyleProps){

    const title = useMemo(()=>{
        return titleString?titleString:variantData?.preferredTitle||undefined;
    },[titleString, variantData])

    const sections = useMemo(()=>{
        if(sheet===undefined)return [];
        return sheet.getSections();
    },[sheet])
 
    if(sections===undefined)return<>
        <Typography variant="subtitle2">Text a akordy nebyly nalezeny.</Typography>
    </>
    
    const font = "Roboto";

    const width = "2rem"

    return (
        <Box fontFamily={font}>
            <Box display={"flex"} flexDirection={"row"} gap={1} sx={{marginBottom:1}}>
                    <Box width={width}></Box>
                    <Box flex={10}>
                    <Typography variant='h5' fontFamily={"inherit"}><b>{title}</b></Typography>
                    
                    </Box>
            </Box>
            {sections.map((section, index) => {
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
                                            {segment.chord&&<Typography sx={{paddingRight: 1}} fontFamily={"inherit"}><b>{segment.chord.toString()}</b></Typography>}
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
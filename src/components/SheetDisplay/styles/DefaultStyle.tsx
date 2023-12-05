import { Box, Typography } from "@mui/material";
import songObject from "../../../interfaces/song/song";
import React, { useMemo } from 'react'
import { VariantDTO } from "../../../interfaces/variant/VariantDTO";
import { Chord, Sheet } from "@pepavlin/sheet-api";
import { SheetStyleComponentType } from "./config";
import { Segment } from "@pepavlin/sheet-api/lib/sheetApi/conversition/song";

const chordHeight = "1.5em";
const SegmentComponent = ({segment}: {segment: Segment}) => {

    const words = useMemo(()=>{
        return segment.text?.split(/(\s+)/)||[];
    },[segment])

    return <>
        {words.map((word, index)=>{

            return <Box>
                {index == 0 ? <>
                    <Typography sx={{paddingRight: 1, height: chordHeight}} fontFamily={"inherit"}>
                        <b>
                            {segment.chord?.toString()}
                        </b>
                    </Typography>
                </>:<>
                    <Box sx={{height: chordHeight}}/>
                </>}

                <Typography sx={{flex:1}} fontFamily={"inherit"}>{word}</Typography>
            </Box>
        })}
    </>

}

const DefaultStyle : SheetStyleComponentType = ({sheet, title: titleString}) => {

    const title = useMemo(()=>{
        return titleString||undefined;
    },[titleString])

    const sections = useMemo(()=>{
        if(sheet===undefined)return [];
        return sheet.getSections();
    },[sheet])
 
    if(sections===undefined)return<>
        <Typography variant="subtitle2">Text a akordy nebyly nalezeny.</Typography>
    </>
    
    const font = "Roboto";

    const width = "1rem"

    return (
        <Box fontFamily={font} sx={{
        }}>
            <Box display={"flex"} flexDirection={"row"} gap={1} sx={{marginBottom:1}}>
                    <Box width={width}></Box>
                    <Box flex={10}>
                        <Typography variant='h5' fontFamily={"inherit"}><b>{title}</b></Typography>
                    </Box>
            </Box>
            {sections.map((section, index) => {

                const firstLineHasChord = section.lines
                    &&section.lines[0].segments.reduce((acc, segment)=>acc||segment.chord!==undefined, false);

                return (
                <Box display={"flex"} flexDirection={"row"} gap={1} marginBottom={3} key={"abox"+index}>
                    <Box width={width}>
                        <Typography variant={"subtitle2"} marginTop={firstLineHasChord?3.3:0.3} textAlign={"end"} fontFamily={"inherit"}>{section.name}{section.name==""?"":":"}</Typography>
                    </Box>
                    <Box flex={10}>
                        {section.lines&&section.lines.map((line, index)=>{
                        return (
                            <Box key={"bbox"+index} sx={{
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                            }}>
                            {line.segments.map((segment, index)=>{
                                return <SegmentComponent segment={segment}   key={"cbox"+index}/>
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

export default DefaultStyle;
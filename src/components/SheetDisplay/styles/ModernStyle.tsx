import React, { useMemo } from 'react'
import { SheetStyleComponentType } from './config';
import { Box, Grid, Typography } from '@mui/material';
import { Section, Segment } from '@pepavlin/sheet-api/lib/sheetApi/conversition/song';
import { sectionNameToText } from '../../../tech/sectionNameToText';

const chordHeight = "1.5em";

const SegmentElement = ({segment}: {segment: Segment}) => {
    const words = useMemo(()=>{
        return segment.text?.split(/(\s+)/)||[];
    },[segment])

    return <>
        {words.map((word, index)=>{

            return <Box>
                {index == 0 ? <>
                    <Typography sx={{height: chordHeight}} fontWeight={900}>
                        {segment.chord?.toString()}
                    </Typography>
                </>:<>
                    <Box sx={{height: chordHeight}}/>
                </>}

                <Typography>
                    {word}
                </Typography>
            </Box>
        })}
    </>
}

const SectionComponent = ({section}: {section: Section}) => {
    const sectionName = useMemo(()=>{
        if(!section.name) return undefined;
        return sectionNameToText(section.name);
    },[section])
    return <>
        <Box sx={{
            paddingTop: chordHeight,
        }}>
            {sectionName&&<Typography fontStyle={"italic"} noWrap fontWeight={500} sx={{
                paddingRight: "2em",
            }}>
                {sectionName}
            </Typography>}
        </Box>
        <Box>
            {section.lines? <>
            
                {section.lines.map((line, index)=>{
                    return <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                    }}>
                        {line.segments.map((segment, index)=>{
                            return <SegmentElement segment={segment}/>
                        })}
                    </Box>
                })}
                

            </>:<>
            </>}

        </Box>
    </>
}

const  ModernStyle : SheetStyleComponentType = ({
    sheet,
    title
}) => {
    
    const sections = useMemo(()=>{
        if(sheet===undefined)return [];
        return sheet.getSections();
    },[sheet])

    return (
        <Box sx={{

        }}>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                // alignItems: "center",
                // justifyContent: "center",
            }}>
                {title && <Box sx={{
                    marginBottom: 1,
                }}>
                    <Typography variant='h5' ><b>{title}</b></Typography>
                </Box>}
                
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "min-content 1fr",
                    width: "fit-content",
                }}>
                    {sections.map((section, index)=>{
                        return <SectionComponent section={section}/>
                    })}
                </div>
            </Box>

        </Box>
    )
}
export default ModernStyle;
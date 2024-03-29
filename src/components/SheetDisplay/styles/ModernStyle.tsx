import React, { useMemo } from 'react'
import { SheetStyleComponentType } from './config';
import { Box, Grid, Typography } from '@mui/material';
import { sectionNameToText } from '../../../tech/sectionNameToText';
import { signature } from '@pepavlin/sheet-api/lib/models/note';
import { Section } from '@pepavlin/sheet-api/lib/models/song/section';
import { Segment } from '@pepavlin/sheet-api/lib/models/song/segment';

const chordHeight = "1.5em";

const SegmentElement = ({segment, signature}: {segment: Segment, signature?: signature}) => {
    const words = useMemo(()=>{
        return segment.text?.split(/(\s+)/)||[];
    },[segment])

    return <>
        {words.map((word, index)=>{

            return <Box>
                {index == 0 ? <>
                    <Typography sx={{height: chordHeight}} fontWeight={900}>
                        {segment.chord?.toString(signature)}
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

const SectionComponent = ({section, signature}: {section: Section, signature?: signature}) => {
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
                            return <SegmentElement segment={segment} signature={signature}/>
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
    title,
    signature
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
                        return <SectionComponent section={section} signature={signature}/>
                    })}
                </div>
            </Box>

        </Box>
    )
}
export default ModernStyle;
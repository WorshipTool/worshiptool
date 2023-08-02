import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import useSong from '../../../hooks/song/useSong';
import { Backdrop, Box, Button, Chip, CircularProgress, IconButton, Typography } from '@mui/material';
import { sectionNameToText } from '../../../tech/sectionNameToText';
import { Section } from '@pepavlin/sheet-api/lib/sheetApi/conversition/song';
import { PlaylistItemDTO } from '../../../interfaces/playlist/PlaylistDTO';
import { Sheet } from '@pepavlin/sheet-api';
import Gap from '../../../components/Gap';

const sectionPart = (section: Section, fontSize: number) => {
    const lines = section.lines;

    return <Box>
        {section.name&&<>
            <Typography fontWeight={"bold"} fontSize={fontSize+2} color={"inherit"} sx={{
                color:"red"
            }}>
                {sectionNameToText(section.name).toUpperCase()}
            </Typography>
        </>}
        {lines&&lines.map((line, index)=>{
            return <Box display={"flex"} flexDirection={"row"}  key={"bbox"+index}>
            {line.segments.map((segment, index)=>{
                return(
                    <Box display={"flex"} flexDirection={"column"}  key={"cbox"+index}>
                        <Box sx={{flex:1}}>
                            {segment.chord&&<Typography sx={{paddingRight: 1, fontSize:fontSize, color: "#FCF300"}}><b>{segment.chord.toString()}</b></Typography>}
                        </Box>
                        
                        <Typography sx={{flex:1, fontSize: fontSize}}>{segment.text}</Typography>
                    </Box>
                )
            })}
        </Box>
        })}
    </Box>
}

interface SlideCardProps{
    item: PlaylistItemDTO
}

export default function SlideCard({item}: SlideCardProps) {

    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);


    const [sizeChanging, setSizeChanging] = useState(true);

    const [songIndex, setSongIndex] = useState(0);

    const [size, setSize] = useState(20);
    const [sizeSet, setSizeSet] = useState(false);

    const [sheet, setSheet] = useState<Sheet>();

    const lastSectionRef = useRef();

    const [loading, setLoading] = useState(true);

    const PADDING = 40;

    useEffect(()=>{


        setSizeChanging(true);

        setSize((s)=>s-1);
        setSizeSet(false);

        if(!item) return;
        setSheet(new Sheet(item.variant.sheetData));

        setLoading(true);
        setTimeout(()=>{
            setLoading(false);
        }, 1000)

    },[item])

    useEffect(()=>{
        if(!sheet) return;
        sheet.setKey(item.toneKey);
    },[sheet]);



    useEffect(()=>{
        if(!lastSectionRef?.current){
            // Make a loop
            setSize((s)=>s+0.5);
            return;
        }
        
        // Get box position (x,y) and size
        // @ts-ignore
        const boxX : number = lastSectionRef.current.offsetLeft;
        // @ts-ignore
        const boxY : number = lastSectionRef.current.offsetTope;
        
        // @ts-ignore
        const boxWidth : number = lastSectionRef.current.offsetWidth;
        // @ts-ignore
        const boxHeight : number = lastSectionRef.current.offsetHeight;
        
        // Calculate corner position
        const cornerX : number = boxX + boxWidth;
        const cornerY : number = boxY + boxHeight;
        
        const maxX = windowWidth - PADDING*2;
        const maxY = windowHeight - PADDING*2;
        
        const xIsOut = cornerX > maxX;
        const yIsOut = cornerY > maxY;
        
        
        const cornerIsOut : boolean = xIsOut || yIsOut;
        
        if(cornerIsOut){
            setSizeSet(false);
            setSizeChanging(true);
        }else{
            setSizeChanging(false);
        }
        if(sizeSet) return;
        
        if(!cornerIsOut){
            setSize((s)=>s+1);
        }else{
            setSize((s)=>s-1);
            setSizeSet(true);
        }

    },[lastSectionRef, size, sizeSet]);



    useEffect(()=>{
        setSizeSet(false);
    },[windowWidth,windowHeight])

    useLayoutEffect(() => {
        function updateSize() {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);


    
    const COLOR = "white";
    
    return (
        <Box display={"flex"} flexDirection={"column"} flex={1} sx={{
            bgcolor: "#000",
            color: COLOR,
            userSelect: "none",
        }}>
            <Box display={"flex"} flexDirection={"column"} height={`calc(100vh - ${PADDING}px - ${PADDING}px)`} width={"100%"}
                flexWrap={"wrap"} alignContent={"center"} alignItems={"stretch"} justifyContent={"center"} sx={{
                
                    paddingTop: PADDING+"px",
                    paddingBottom: PADDING+"px",

            }}>
                <Typography fontWeight={"bold"} fontSize={size+5} marginRight={2}>
                    {(item?.order+1) + ". "}
                    {item?.variant.preferredTitle.toUpperCase()}
                </Typography>
                {sheet?.getSections()?.map((section, index)=>{
                    return <Box sx={{
                        borderRadius: 2,
                        paddingTop: 4,
                        marginRight:3,
                        // marginLeft: 3
                        // bgcolor:"red",
                        
                    }} ref={index===sheet.getSections().length-1 ? lastSectionRef : undefined}>
                        {sectionPart(section, size)}
                    </Box>;
                })}

            </Box>
            <Box bgcolor={"black"} position={"absolute"} left={0} top={0} right={0} bottom={0}
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                display={loading? "flex" : "none"} justifyContent={"center"} alignItems={"center"}
                >
                <CircularProgress color="inherit" />
                <Gap horizontal value={2}/>
                <Typography variant='h6'>{item?.variant.preferredTitle}</Typography>
            </Box>
        </Box>
    )
}

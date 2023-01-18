import { Box, Grid, InputBase, Skeleton, TextField, Typography, styled, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import SearchItem from './SearchItem';
import sheepImage from '../../assets/sheepWithCircle.png'
import useFetch from '../../hooks/useFetch';
import { songGetQueryDTO, songGetResultDTO } from '../../backend/dtosSong';
import { getUrl_GETSONGSBYQUERY } from '../../backend/urls';
import { RequestResult, isSuccess } from '../../backend/dtosRequestResult';
import geometryImage from '../../assets/geometry.png'
import Toolbar from '../../components/Toolbar';
import { ModuleDetectionKind } from 'typescript';
import { AnimatePresence, motion } from 'framer-motion';


const AligningContainer = styled(Box)(({theme})=>({
    display: "flex",
    justifyContent:"center",
    position: "sticky",
    top:"4rem",
    [theme.breakpoints.down('md')]: {
        flexDirection:"column",
    },
    [theme.breakpoints.up('md')]: {
        flexDirection:"row",
    },
    width:"100%",
    backgroundColor:"blue"
}))

const SearchContainer = styled(Box)(({theme})=>({
    backgroundColor: theme.palette.grey[100],
    padding: "0.5rem",
    paddingLeft:"0.8rem",
    paddingRight:"0.8rem",
    borderRadius: "0.5rem",
    display:"flex",
    
    justifyContent:"center",
    alignItems:"center",

}))
const SearchContainerBorder = styled(Box)(({theme})=>({
    background: `linear-gradient(100deg, ${theme.palette.primary.main},${theme.palette.warning.main}, ${theme.palette.secondary.main})`,
    boxShadow: `0px 3px 4px ${theme.palette.grey[500]}`,
    width: "100%",
    borderRadius: "0.6rem",
    padding: 2

}))
const SearchInput = styled(InputBase)(({theme})=>({
    flex:1,
    marginLeft:"0.5em",
    zIndex:100
}))

const GridContainer = styled(Grid)(({theme})=>({
    padding:10,
    paddingTop: 5
    
}))


export default function Home() {
    const theme = useTheme();
    const [searchValue, setSearchValue] = useState("");
    const [isTop, setTop] = useState(true);
    const [searching, setSearching] = useState(false);

    const [songGUIDs, setSongGUIDs] = useState<string[]>([]);

    const [recommendedSongGUIDs, setRecommendedSongGUIDs] = useState<string[]>([]);

    const {fetchData} = useFetch();

    const scrollPointRef = useRef(null)

    useEffect(()=>{
        if(searchValue==""){
            setSongGUIDs([]);
        }else{
            if(scrollPointRef.current){
                const s : any = scrollPointRef.current;
                s.scrollIntoView();
            }
            const query : songGetQueryDTO = {
                key: "search",
                body: searchValue
            }
            fetchData({url: getUrl_GETSONGSBYQUERY(query)}, (data : RequestResult<songGetResultDTO>)=>{

                if(isSuccess(data)){
                    setSongGUIDs(data.data.guids);
                    
                }

                
            });
        }
        

        
    },[searchValue])

    useEffect(()=>{
        const query : songGetQueryDTO = {
            key: "random",
            count: 16
        }
        fetchData({url: getUrl_GETSONGSBYQUERY(query)}, (data : RequestResult<songGetResultDTO>)=>{

            if(isSuccess(data)){
                setRecommendedSongGUIDs(data.data.guids);
            }
        });
    },[])


    const onSearchValueChange = (event: any) => {
        setSearching(true);
        setSearchValue(event.target.value);
    }   




    useEffect(() => {
        const handleScroll = (event:any) => {
            const level = 50;
            const sy = window.scrollY;
            if(sy>level){
                setTop(false)
            }else{
                setTop(true);
            }
            
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const animationDuration = 0.2;

    return (
        <Box>
            <Toolbar transparent={isTop}/>
            <Box sx={{flex:1, justifyContent:"center", alignItems:"start", display:"flex", flexDirection:"column"}}>
                <motion.div 
                    style={{
                        position:"fixed",
                        left:"30%",
                        right:"30%",
                        display:"flex",
                        flexDirection:"column",
                        zIndex:10
                    }}
                    animate={{
                        top:isTop?"35%":25
                    }}
                    transition={{
                        type:"keyframes",
                        duration: animationDuration
                    }}>

                    <motion.div
                         animate={{
                            height: isTop?"7rem":"0",
                            opacity:isTop?1:0
                         }}
                         transition={{
                            type:"keyframes",
                            duration: 0.1
                         }}
                         style={{display: "flex",justifyContent:"center", marginBottom:2, flexDirection:"column" }}>
                            <Typography variant='h4' fontWeight={"200"}>Jsi ovce?</Typography>
                            <Typography variant='h2' fontWeight={"bold"}>Chval Otce</Typography>
                        </motion.div>

                    <motion.div style={{
                            background: `linear-gradient(100deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            boxShadow: `0px 3px 4px ${theme.palette.grey[500]}`,
                            width: "100%",
                            borderRadius: "0.6rem",

                        }}
                        animate={{
                            padding: isTop?2:0
                        }}>
                        <SearchContainer>                    
                            <SearchIcon />
                            <SearchInput placeholder='Hledej...' onChange={onSearchValueChange} autoFocus value={searchValue}></SearchInput>
                            <MenuIcon/>
                        </SearchContainer>
                    </motion.div>
                </motion.div>
                <Box sx={{height:65}}></Box>

                <div ref={scrollPointRef}></div>

                <Box sx={{height:550}}></Box>
                
                <motion.div style={{
                        left:0,right:0,
                        paddingLeft: 40, 
                        paddingRight:40         
                    }}
                    animate={{
                        top: isTop?"80%":170,
                        position:isTop?"fixed":"absolute"
                    }}
                    transition={{
                        type: "keyframes",
                        duration: animationDuration
                    }}>
                    <Typography fontWeight={"bold"}>Nějaký nápad:</Typography>
                    <GridContainer container columns={{ xs: 1, sm: 2, md: 4 }} sx={{padding:0}} spacing={1}>
                        {recommendedSongGUIDs.slice(0,5).map((g)=>{
                            return <SearchItem guid={g} key={g}></SearchItem>
                        })}
                    </GridContainer>
                </motion.div>
        
            </Box>
        </Box>
        
    )
}

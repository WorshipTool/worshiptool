import { Box, Button, Grid, InputBase, Typography, styled, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import SearchedSongsList from './components/SearchedSongsList';
import RecommendedSongsList from './components/RecommendedSongsList/RecommendedSongsList';
import Toolbar from '../../components/Toolbars/Toolbar';
import FloatingAddButton from './components/FloatingAddButton';
import ContainerGrid from '../../components/ContainerGrid';
import { useNavigate } from 'react-router-dom';


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
const SearchInput = styled(InputBase)(({theme})=>({
    flex:1,
    marginLeft:"0.5em",
    zIndex:100
}))

export default function HomeDesktop() {
    const theme = useTheme();

    const [isTop, setTop] = useState(true);
    const scrollPointRef = useRef(null)
    
    const [searchValue, setSearchValue] = useState("");
    const [showSearchedList, setShowSearchedList] = useState(false);
    
    const animationDuration = 0.2;

    /**
     * Calculation value to correct window height
     * ...handles resizing
     */
    const [correctingOffsetForWindowHeight, setcorrectingOffsetForWindowHeight] = useState(1000);
    useEffect(()=>{        
        const onResize = () => {
            const min = (window.innerHeight);
            setcorrectingOffsetForWindowHeight(min);
        }
        onResize();
        window.addEventListener("resize", onResize);
        return ()=>{
            window.removeEventListener("resize", onResize);
        }
        
    },[])

    
    const onSearchValueChange = (event: any) => {
        setShowSearchedList(true);
        setSearchValue(event.target.value);
    }   

    const scrollLevel = 50;
    

    useEffect(()=>{
        if(searchValue==""){
        }else{
            window.scroll({
                top: scrollLevel*2,
                left: 0,
                behavior: "smooth",
              });

        }
    },[searchValue])


    useEffect(() => {
        const handleScroll = (event:any) => {
            const sy = window.scrollY;
            if(sy>scrollLevel){
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
    
    const navigate = useNavigate();
    const openList = () => {
        navigate("/list");
    }

    
  return (<>
    <Toolbar transparent={isTop}/>

    <Box sx={{flex:1, justifyContent:"center", alignItems:"start", display:"flex", flexDirection:"column"}}>
                <motion.div 
                    style={{
                        position:"fixed",
                        left: 0, right: 0,
                        display:"flex",
                        flexDirection:"column",
                        zIndex:10,
                        alignItems:"center", 
                        pointerEvents:"none"
                    }}
                    animate={{
                        top:isTop?"35%":28
                    }}
                    transition={{
                        type:"keyframes",
                        duration: animationDuration
                    }}>
                    <ContainerGrid>
                        <Grid item xs={12}>
                            <Grid container justifyContent="center" >
                                <Grid item xs={6} sx={{pointerEvents: "auto"}}>
                                    <motion.div
                                        animate={{
                                            height: isTop?"7rem":"0",
                                            opacity:isTop?1:0
                                        }}
                                        transition={{
                                            type:"keyframes",
                                            duration: animationDuration/2
                                        }}
                                        style={{display: "flex",justifyContent:"center", marginBottom:2, flexDirection:"column", userSelect: "none"}}>
                                        <Typography variant='h4' fontWeight={"200"}>Jsi-li ovce, tak...</Typography>
                                        <Typography variant='h2' fontWeight={"bold"} >Chval Otce</Typography>
                                    </motion.div>

                                    <motion.div style={{
                                            background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
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
                                            
                                        </SearchContainer>
                                    </motion.div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </ContainerGrid>
                    
                </motion.div>
                <Box sx={{height:65}}></Box>


                <div ref={scrollPointRef}></div>

                <Box sx={{height:correctingOffsetForWindowHeight}}></Box>
                
                <motion.div
                    style={{
                        left:0,right:0,
                        position: "fixed",
                        display: "flex",
                        flexDirection: "column",
                        alignItems:"center",
                        padding: theme.spacing(2)
                    }}
                    animate={{
                        top: isTop?"80%":170,
                        position:isTop?"fixed":"absolute"
                    }}
                    transition={{
                        type: "keyframes",
                        duration: animationDuration
                    }}>

                    
                    {showSearchedList&&<SearchedSongsList searchString={searchValue}/>}
                        

                    <RecommendedSongsList/>
                    
                </motion.div>
               
        
            </Box>

            <FloatingAddButton/>
        </>
  )
}

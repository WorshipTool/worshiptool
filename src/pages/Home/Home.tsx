import { Backdrop, Badge, Box, Button, Fab, Grid, InputBase, Skeleton, SpeedDial, SpeedDialAction, SpeedDialIcon, TextField, Typography, styled, useTheme } from '@mui/material'
import React, { createRef, useEffect, useRef, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import SearchItem from './SearchItem';
import sheepImage from '../../assets/sheepWithCircle.png'
import useFetch from '../../hooks/useFetch';
import { songGetQueryDTO, songGetResultDTO } from '../../backend/dtos/dtosSong';
import { RequestResult, isRequestSuccess } from '../../backend/dtos/RequestResult';
import geometryImage from '../../assets/geometry.png'
import Toolbar from '../../components/Toolbar';
import { ModuleDetectionKind } from 'typescript';
import { AnimatePresence, motion } from 'framer-motion';
import Gap from '../../components/Gap';
import Carousel from 'react-material-ui-carousel';
import usePagination from '../../hooks/usePagination';
import { useIsInViewport } from '../../hooks/useIsInViewport';
import Masonry from '@mui/lab/Masonry';
import { Add, AddAPhotoRounded, Close, Cloud, Edit, Movie, PermMedia, PlayArrow, Subscript, Subscriptions } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/auth/useAuth';
import useSongQuery from '../../hooks/song/useSongQuery';
import AddVideo from '../../components/AddVideo';
import AddSource from '../../components/AddSource';
import { machine } from './machine';
import { useMachine } from '@xstate/react';
import SearchedSongsList from './SearchedSongsList';
import RecommendedSongsList from './RecommendedSongsList';


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



export default function Home() {
    const theme = useTheme();

    const [isTop, setTop] = useState(true);
    const [offsetHeight, setOffsetHeight] = useState(1000);
    const scrollPointRef = useRef(null)

    const [searchValue, setSearchValue] = useState("");
    const [searching, setSearching] = useState(false);
    const [showSearchedList, setShowSearchedList] = useState(false);

    const {isLoggedIn, isAdmin} = useAuth();

    const navigate = useNavigate();

    const [addVideoOpen, setAddVideoOpen] = useState(false);
    const [addSourceOpen, setAddSourceOpen] = useState(false);


    

    const onResize = () => {
        const min = (window.innerHeight);
        setOffsetHeight(min);
    }


    useEffect(()=>{        

        window.addEventListener("resize", onResize);

        onResize();
        
        return ()=>{
            window.removeEventListener("resize", onResize);
        }
        
    },[])

    useEffect(()=>{
        if(searchValue==""){
            setSearching(false);
        }else{
            if(scrollPointRef.current){
                const s : any = scrollPointRef.current;
                s.scrollIntoView();
            }
        }
    },[searchValue])

    useEffect(()=>{
        document.title = "Chval Otce"
    },[])

    const onSearchValueChange = (event: any) => {
        setSearching(true);
        setShowSearchedList(true);
        setSearchValue(event.target.value);
    }   

    const onAddClick = () => {
        navigate("/create");
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
        <Box >
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
                            duration: animationDuration/2
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

                <Box sx={{height:offsetHeight}}></Box>
                
                <motion.div
                    style={{
                        left:0,right:0,
                        paddingLeft: 40, 
                        paddingRight:40,
                        position: "fixed"         
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
            
            {isLoggedIn()&&<>


                <SpeedDial
                    ariaLabel="SpeedDial openIcon example"
                    sx={{ position: 'fixed', bottom: 30, right: 30 }}
                    icon={<SpeedDialIcon openIcon={<Close />} />}>
                        <SpeedDialAction
                            icon={<Edit />}
                            tooltipTitle={"Přidej text a akordy"}
                            onClick={onAddClick}
                            />
                        
                        {isAdmin()&&<SpeedDialAction
                            icon={<Subscriptions />}
                            tooltipTitle={"Přidej video"}
                            onClick={()=>{setAddVideoOpen(true)}}
                            />}

                        {isAdmin()&&<SpeedDialAction
                            icon={<Cloud />}
                            tooltipTitle={"Přidej zdroj"}
                            onClick={()=>{setAddSourceOpen(true)}}
                            />}
                        
                </SpeedDial>


                <AddVideo open={addVideoOpen} handleClose={()=>setAddVideoOpen(false)} afterUpload={(r)=>{
                    navigate("/song/"+r.data.songGuid);
                }}/>
                <AddSource open={addSourceOpen} handleClose={()=>setAddSourceOpen(false)} afterUpload={(r)=>{
                    navigate("/song/"+r.data.songGuid);
                }}/>

            </>}
        </Box>
        
    )
}

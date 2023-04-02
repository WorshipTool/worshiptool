import { Box, InputBase, SpeedDial, SpeedDialAction, SpeedDialIcon,  Typography, styled, useTheme } from '@mui/material'
import React, {useEffect, useRef, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '../../components/Toolbar';
import { motion } from 'framer-motion';
import { Close, Cloud, Edit, Subscriptions } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/auth/useAuth';
import AddVideo from '../../components/AddVideo';
import AddSource from '../../components/AddSource';
import SearchedSongsList from './SearchedSongsList';
import RecommendedSongsList from './RecommendedSongsList';
import { grey } from '@mui/material/colors';


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
            <Box sx={{flex:1, justifyContent:"center", alignItems:"start", display:"flex", flexDirection:"column",
                [theme.breakpoints.down('sm')]: {
                    display:"none"
                }}}>
                <motion.div 
                    style={{
                        position:"fixed",
                        left:"26%",
                        right:"26%",
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
                         style={{display: "flex",justifyContent:"center", marginBottom:2, flexDirection:"column",}}>
                            <Typography variant='h4' fontWeight={"200"}>Jsi ovce?</Typography>
                            <Typography variant='h2' fontWeight={"bold"} >Chval Otce</Typography>
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

            <Box sx={{display:"none", flex:1, justifyContent:"center", alignItems:"start", flexDirection:"column",
                [theme.breakpoints.down('sm')]: {
                    display:"flex"
                }}}>
                 <Box sx={{display:"flex", width:"100%", flexDirection: "row", position:"fixed", top:45}}>
                    <Box sx={{flex:1, margin:1}}>
                        <SearchContainer sx={{boxShadow: "0px 4px 5px" + theme.palette.grey[400]}}>                    
                           <SearchIcon />
                           <SearchInput placeholder='Hledej...' onChange={onSearchValueChange} autoFocus value={searchValue}></SearchInput>
                           <MenuIcon/>
                        </SearchContainer>
                    </Box>
                 </Box>


                 <Box sx={{height:60}}></Box>
                <div ref={scrollPointRef}></div>


                <Box margin={1}>
                    {showSearchedList&&<SearchedSongsList searchString={searchValue}/>}                           
                    
                    <RecommendedSongsList/>
                </Box >
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

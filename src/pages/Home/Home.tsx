import { Box, Grid, InputBase, TextField, Typography, styled, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import SearchItem from './SearchItem';
import sheepImage from '../../assets/sheepWithCircle.png'
import useFetch from '../../hooks/useFetch';
import { songGetQueryDTO, songGetResultDTO } from '../../backend/dtos';
import { getUrl_GETSONGSBYQUERY } from '../../backend/urls';


const AligningContainer = styled(Box)(({theme})=>({
    display: "flex",
    justifyContent:"center",
    position: "sticky",
    top:0,
    [theme.breakpoints.down('md')]: {
        flexDirection:"column",
    },
    [theme.breakpoints.up('md')]: {
        flexDirection:"row",
    },
    width:"100%"
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
    boxShadow: `0px 3px 4px ${theme.palette.grey[500]}`,
    [theme.breakpoints.down('md')]: {
        flex:1,
    },
    [theme.breakpoints.up('md')]: {
        width: "50%",
    },
    margin: "0.5rem",
    borderColor: theme.palette.grey[300]

}))
const SearchInput = styled(InputBase)(({theme})=>({
    flex:1,
    marginLeft:"0.5em"
}))

const GridContainer = styled(Grid)(({theme})=>({
    padding:10,
    paddingTop: 5
    
}))

export default function Home() {

    const [searchValue, setSearchValue] = useState("");
    const [searching, setSearching] = useState(false);

    const [songGUIDs, setSongGUIDs] = useState<string[]>([]);

    const [recommendedSongGUIDs, setRecommendedSongGUIDs] = useState<string[]>([]);

    const {fetchData} = useFetch();

    useEffect(()=>{
        if(searchValue==""){
            setSongGUIDs([]);
        }else{
            const query : songGetQueryDTO = {
                key: "search",
                body: searchValue
            }
            fetchData({url: getUrl_GETSONGSBYQUERY(query)}, (data : songGetResultDTO, error?: any)=>{

                if(error){

                }else{
                    setSongGUIDs(data.guids);
                }

                
            });
        }
        

        
    },[searchValue])

    useEffect(()=>{
        const query : songGetQueryDTO = {
            key: "random",
            count: 4
        }
        fetchData({url: getUrl_GETSONGSBYQUERY(query)}, (data : songGetResultDTO, error:any)=>{

            if(error){
                console.log(error);
            }else{
                setRecommendedSongGUIDs(data.guids);
            }
        });
    },[])


    const onSearchValueChange = (event: any) => {
        setSearching(true);
        setSearchValue(event.target.value);
    }   



    

        

    return (
        <Box sx={{flex:1, justifyContent:"center", height:(searching?"auto":"100vh"), alignItems:"center", display:"flex", flexDirection:"column"}}>

            {!searching&&<Box sx={{alignItems:"center", justifyContent:"center", display:"flex", marginBottom:-1}}>
                <img src={sheepImage} width={200}/>
            </Box>}

            <AligningContainer>
                <SearchContainer>
                    <SearchIcon />
                    <SearchInput placeholder='Hledej...' onChange={onSearchValueChange} autoFocus value={searchValue}></SearchInput>
                    <MenuIcon/>
                </SearchContainer>
            </AligningContainer>

            {!searching&&
                <Box sx={{height:30}}>
                </Box>
            }


            {searching&&
                <>
                    
                    <GridContainer container columns={{ xs: 1, sm: 2, md: 4 }} spacing={1}>
                        {searchValue!=""&&songGUIDs.map((value, index)=>{
                            return <SearchItem guid={value} key={value}></SearchItem>
                        })}

                        
                        
                    </GridContainer>
    
                    {songGUIDs.length==0&&searchValue!=""&&<Typography marginBottom={2}>Nic jsme nenašli...</Typography>}
                </>
            }
            {(songGUIDs.length==0||searchValue=="")&&recommendedSongGUIDs.length>0&&
            <Box width={"100%"}>
                <Typography  paddingLeft={2} fontWeight={"bold"}>Nějaké nápady:</Typography>
                <GridContainer container columns={{ xs: 1, sm: 2, md: 4 }} spacing={1}>    
                    {recommendedSongGUIDs.map((value)=>{
                        return <SearchItem guid={value} key={value}></SearchItem>
                    })}
                    
                    
                </GridContainer>
            </Box>
            }
       
        </Box>
    )
}

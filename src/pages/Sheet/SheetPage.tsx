import React, { useEffect, useMemo, useState } from 'react'
import AppContainer from '../../components/AppContainer/AppContainer'
import { useParams } from 'react-router-dom';
import useSong from '../../hooks/song/useSong';
import { Sheet } from '@pepavlin/sheet-api';
import SheetDisplay from '../../components/SheetDisplay/SheetDisplay';
import ContainerGrid from '../../components/ContainerGrid';
import { Box, useTheme } from '@mui/material';
import TopPanel from './components/TopPanel';
import Gap from '../../components/Gap';
import { VariantDTO } from '../../interfaces/variant/VariantDTO';


const styledContainerSX = {
}

export default function SheetPage() {
    const {guid} = useParams();
    const {setGUID, song, reload, getName, loading} = useSong(null);
    const [variantID, setVariantID] = useState(0);
    const [currentSheet, setCurrentSheet] = useState<Sheet>();

    const [justNumber, setJustNumber] = useState(0);

    const theme = useTheme();

    const title = useMemo(()=>{
        return song?.variants[variantID]?.preferredTitle || getName()
    },[song?.variants, getName()])

    
    useEffect(()=>{
        if(guid) setGUID(guid);
    },[])

    useEffect(()=>{
        if(song){
            console.log(song)
          const sheet = new Sheet(song.variants[variantID].sheetData);
          setCurrentSheet(sheet);
        }
      },[variantID, song])

    useEffect(()=>{     
        document.title = title
    },[title])

    const rerender = () => {
        setJustNumber((j)=>j+1);
    }

    const transpose = (value: number) => {
        if(currentSheet){
            currentSheet.transpose(value);
            rerender();
        }
    }

  return (
    <AppContainer>
        <Box sx={{
            display:"flex",
            displayPrint: "none",
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <ContainerGrid sx={{
                marginTop: 2,
                marginBottom: 2,
                padding:3,
                backgroundColor: theme.palette.grey[100],
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: theme.palette.grey[400],
                borderRadius: 1,
                flex:1,
                display:"flex",
                flexDirection: "column"
            }}  >
                {song?.variants[variantID] && 
                    <TopPanel 
                        transpose={transpose} 
                        variant={song?.variants[variantID]} 
                        reloadSong={reload}
                        sheet={currentSheet as Sheet}
                        song={song}
                        />}
                
                <Gap value={2}/>

                {currentSheet && <>
                    <SheetDisplay sheet={currentSheet} title={title} variant={"default"}/>
                </>}
                
            </ContainerGrid>
        </Box>
        <Box displayPrint={"block"} display={"none"}>
            {currentSheet && <>
                <SheetDisplay sheet={currentSheet} title={title} variant={"default"}/>
            </>}
        </Box>
    </AppContainer>
  )
}

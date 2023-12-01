import React from 'react'
import Song from '../../../interfaces/song/song'
import { Box, Chip, Typography } from '@mui/material'
import { MediaTypes } from '../../../interfaces/song/media'
import YoutubeVideo from '../../../components/YoutubeVideo'
import { VariantDTO } from '../../../interfaces/variant/VariantDTO'
import { SourceTypes } from '../../../interfaces/song/source'
import useAuth from '../../../hooks/auth/useAuth'

interface AdditionalSongInfoPanelProps {
    song: Song,
    variant: VariantDTO
}

export default function AdditionalSongInfoPanel({song, variant}: AdditionalSongInfoPanelProps) {
    const {isAdmin, isLoggedIn} = useAuth()
    return (
        <Box>

            {/* VIDEOS */}
            {isLoggedIn()?<>
                {song.media.map((m)=>{
                    if(m.type===MediaTypes.Youtube){
                        return <YoutubeVideo src={m.url} key={m.url}></YoutubeVideo>
                    }else{
                        return <Typography>Našli jsme přílohu, ale nevíme jak si s ní poradit.</Typography>
                    }
                })}
            </>:<></>}

            <Box>
                {/* RESOURCES */}
                {variant.sources.length>0&&<>
                    <Typography variant='subtitle2'>Zdroje</Typography>

                    <Box display={"flex"} flexDirection={"row"} gap={0.5}>
                        {variant.sources.map((s)=>{
                            if(s.type==SourceTypes.Url){
                            
                            const onClick = ()=>{
                                window.open(s.value, '_blank', 'noreferrer');
                            }
                            return <>
                                <Chip label={s.value} onClick={onClick} sx={{cursor: "pointer"}} key={s.value}/>
                            </>
                            }
                            return <>
                                <Chip label={s.value}/>
                            </>
                        })}
                    </Box>
                </>}

                {isAdmin()?<>
                    {/* TAGS */}
                    {song.tags.length>0&&<>
                        <Typography variant='subtitle2'>Tagy</Typography>
                        <Box display={"flex"} flexDirection={"row"} flexWrap={"wrap"} gap={0.5}>
                            {song.tags.map((s)=>{
                                return <Chip label={s} key={s}/>
                            })}                      
                        </Box >
                    </>}

                    {/* CREATORS */}
                    {song.creators.length>0&&<>
                        <Typography variant='subtitle2'>Autoři</Typography>
                        <Box display={"flex"} flexDirection={"row"} gap={0.5}>
                            {song.creators.map((s)=>{
                                return <Chip label={s.name} key={s.name}/>
                            })}
                        </Box >
                    </>}

                </>:<></>}

                
            </Box>
        </Box>
    )
}

import React from 'react'
import { VariantDTO } from '../../../../interfaces/variant/VariantDTO';
import { Box, Skeleton, Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../../hooks/auth/useAuth';

const StyledContainer = styled(Box)(({theme})=>({
    backgroundColor: theme.palette.grey[100],

    padding: "1rem",
    borderRadius:"0.5rem",
    "&:hover":{
        backgroundColor: theme.palette.grey[200],
        boxShadow: `0px 0px 10px ${theme.palette.grey[400]}`,
    },
    cursor:"pointer",
    borderWidth:1.4,
    borderStyle: "solid"
}))

const StyledBox = styled(Typography)(({theme})=>({
    maxWidth: 'calc(100vw - 3rem)',
    overflow: "hidden"
}))

interface SearchItemProps {
    variant: VariantDTO;
    onClick?: (variant: VariantDTO)=>void
}
export default function SearchItem({variant, onClick}: SearchItemProps) {
    const onSongClick = () => {
        onClick?.(variant);
    }
    const {user} = useAuth();

  return (
    <Box>
        {false?
        <Box justifyContent={"center"} display={"flex"} flexDirection={"column"}>
            <Skeleton variant='text' width={"100%"}></Skeleton>
            {Array(2).fill(1).map((a, index)=>{
                return <Skeleton variant='text' width={Math.round(Math.random()*80)+"%"} key={variant.guid+"s"+index}></Skeleton>
            })}
        </Box>
        :
        <StyledContainer onClick={onSongClick} sx={{borderColor:
            variant.verified 
             || (variant.createdByLoader)
            ?"transparent":"grey"}}>
            
            {variant.createdBy==user?.guid&&
                <Typography variant="subtitle2">Vytvořeno vámi.</Typography>}

            <Box display={"flex"}>
                <Typography fontWeight={"bold"} flex={1}>{variant.preferredTitle}</Typography>
                {!variant.verified?<>
                    {variant.createdByLoader?
                        <Typography variant='caption'>Nahráno programem</Typography>
                    :<>
                        <Typography variant='caption'>Neověřeno</Typography>
                    </>}
                </>:
                <>
                    
                </>}
            </Box>

            <StyledBox>
                {variant.sections[0]?.text?.split("\n").slice(0,4).map((line, index)=>{
                    return <Typography noWrap key={"SearchItemText"+index}>{line}</Typography>
                })}
            </StyledBox>
            
        </StyledContainer>
        }
    </Box>
  )
}

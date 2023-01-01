import { Box, Grid, Typography,styled, useTheme } from '@mui/material';
import React from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import YouTubeIcon from '@mui/icons-material/YouTube';

export default function SearchItem(props: {text:string}) {
    const theme = useTheme();
    const StyledContainer = styled(Box)(({})=>({
        backgroundColor: theme.palette.grey[100],
        padding: "1rem",
        borderRadius:"0.5rem"
    }))
  return (
    <Grid item xs={1}>
        <StyledContainer>
            <Typography fontWeight={"bold"}>Cesta</Typography>
            <Typography >Tou cestou</Typography>
            <Typography >tím směrem prý bych se dávno</Typography>
            <Typography >měl dá</Typography>
            <Typography >když sněží, jde to stěží, ale sněhy pak tají</Typography>
            <Typography >nkus něhy ti za nehty slíbí a dají</Typography>
            <Box display={"flex"} justifyContent={"end"} alignItems={"center"}>
                <YouTubeIcon color={"error"} fontSize={"medium"}/>
                <VerifiedIcon color={"success"} fontSize={"medium"}/>
            </Box>
        </StyledContainer>

    </Grid>
  )
}

import { Typography, Box } from '@mui/material';
import Toolbar from '../../components/Toolbar/Toolbar';
import Gap from '../../components/Gap';
export const ErrorPage = () => {
    return <Box>
        
        <Toolbar transparent={true}/>

        <Box display={"flex"} flexDirection={"column"} justifyContent={"end"} alignItems={"center"}
            height={"50vh"}>
            <Typography variant='h1' fontWeight={900}>Oops...</Typography>
            <Gap value={2}/>
            <Typography variant='h6'>Něco se nepovedlo. Stránka nebyla nalezena.</Typography>
        </Box>
    </Box>
};

export default ErrorPage;
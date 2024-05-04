import { Typography, Box, Button } from "@mui/material";
import Toolbar from "../../common/components/Toolbars/Toolbar";
import Gap from "../../common/ui/Gap/Gap";
import Snow from "../../common/components/Snow";
import { Home } from "@mui/icons-material";
export const ErrorPage = () => {
    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
            }}>
            <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"end"}
                alignItems={"center"}>
                <Typography variant="h2" fontWeight={900}>
                    Oops...
                </Typography>
                <Gap value={2} />
                <Typography variant="h6">
                    Něco se nepovedlo. Stránka nebyla nalezena.
                </Typography>
                <Gap value={2} />
                <Button
                    variant="contained"
                    color="primary"
                    href="/"
                    size="medium"
                    endIcon={<Home />}>
                    Jít domů
                </Button>
            </Box>
        </Box>
    );
};

export default ErrorPage;

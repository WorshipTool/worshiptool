import { Box, Card, useTheme } from "@mui/material";
import { useEffect } from "react";
import AppContainer from "../../components/AppContainer/AppContainer";
import useAuth from "../../hooks/auth/useAuth";
import { useSmartNavigate } from "../../routes/useSmartNavigate";
import BasicInfo from "./components/BasicInfo";
import TabsPanel from "./components/TabsPanel";

export default function Account() {
    const { isLoggedIn } = useAuth();

    const navigate = useSmartNavigate();

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate("login", {
                state: {
                    previousPage: window.location.pathname
                }
            });
        }
    }, [isLoggedIn]);

    useEffect(() => {
        document.title = "Váš účet";
    }, []);

    const theme = useTheme();

    return (
        <AppContainer>
            <Box
                sx={{
                    [theme.breakpoints.down("md")]: {
                        display: "none"
                    },
                    padding: 8
                }}>
                <TabsPanel />
            </Box>

            <Card
                sx={{
                    [theme.breakpoints.up("md")]: {
                        display: "none"
                    },
                    padding: 3
                }}>
                <BasicInfo />
            </Card>
        </AppContainer>
    );
}

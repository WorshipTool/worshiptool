import { Box, useTheme } from "@mui/material";
import { useEffect } from "react";
import AppLayout from "../../components/app/AppLayout/AppLayout";
import useAuth from "../../hooks/auth/useAuth";
import { useSmartNavigate } from "../../routes/useSmartNavigate.1";
import BasicInfo from "./components/BasicInfo";
import TabsPanel from "./components/TabsPanel";
import { useWindowTitle } from "../../hooks/useWindowTitle";
import Card from "../../components/Card/Card";

export default function Account() {
    const { isLoggedIn } = useAuth();

    const navigate = useSmartNavigate();
    useWindowTitle("Můj účet");

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate("login", {
                state: {
                    previousPage: window.location.pathname
                }
            });
        }
    }, [isLoggedIn]);

    const theme = useTheme();

    return (
        <AppLayout>
            <Box
                sx={{
                    [theme.breakpoints.down("md")]: {
                        display: "none"
                    },
                    padding: 8
                }}>
                <TabsPanel />
            </Box>

            <Box
                sx={{
                    [theme.breakpoints.up("md")]: {
                        display: "none"
                    }
                }}>
                <BasicInfo />
            </Box>
        </AppLayout>
    );
}

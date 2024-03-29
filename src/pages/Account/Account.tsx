import { Box, Card, Tab, Tabs, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/auth/useAuth";
import Toolbar from "../../components/Toolbars/Toolbar";
import { useNavigate } from "react-router-dom";
import TabPanel from "./components/TabPanel";
import BasicInfo from "./components/BasicInfo";
import AppContainer from "../../components/AppContainer/AppContainer";
import TabsPanel from "./components/TabsPanel";

export default function Account() {
    const { isLoggedIn, user, isTrustee, isAdmin } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate("/login");
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

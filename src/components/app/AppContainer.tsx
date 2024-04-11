import { Box, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AppRoutes } from "../../routes/AppRoutes";
import Snow from "../Snow";
import useAuth from "../../hooks/auth/useAuth";
import LoadingScreen from "./LoadingApp/LoadingScreen";

const Background = styled(Box)(({ theme }) => ({
    background: `linear-gradient(160deg, ${theme.palette.grey[200]}, ${theme.palette.grey[300]})`,
    position: "fixed",
    width: "100%",
    height: "100%",
    zIndex: -100
}));

type AppContainerProps = {};

const LOADING_SCREEN_TIME = 0;

export default function AppContainer(props: AppContainerProps) {
    const { loading: authLoading } = useAuth();
    const [appLoaded, setAppLoaded] = useState(false);
    const [hideLoadingScreen, setHideLoadingScreen] = useState(false);

    useEffect(() => {
        if (appLoaded) return;
        if (authLoading) return;

        setAppLoaded(true);
        // Show loading screen for a while
        const t = setTimeout(() => {
            setHideLoadingScreen(true);
        }, LOADING_SCREEN_TIME);

        return () => {
            clearTimeout(t);
        };
    }, [authLoading]);

    return (
        <>
            <Background />

            {appLoaded && (
                <>
                    <Snow />
                    <AppRoutes />
                </>
            )}
            <LoadingScreen isVisible={!hideLoadingScreen} />
        </>
    );
}

import { Box, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AppRoutes } from "../../../routes/AppRoutes";
import Snow from "../Snow";
import useAuth from "../../../hooks/auth/useAuth";
import LoadingScreen from "./LoadingApp/LoadingScreen";
import { useWindowTitle } from "../../../hooks/useWindowTitle";
import SearchGroupDialog from "../Toolbars/components/Toolsmenu/components/SearchGroupDialog";
import { Background } from "./Background";

type AppContainerProps = {};

const LOADING_SCREEN_TIME = 0;

export default function AppContainer(props: AppContainerProps) {
    const _ = useWindowTitle();

    return (
        <>
            <Background />

            <Snow />
            <AppRoutes />

            <SearchGroupDialog />
        </>
    );
}

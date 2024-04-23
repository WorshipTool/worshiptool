import { Box, IconButton, Tooltip, styled } from "@mui/material";
import React, { ReactElement, ReactNode, useEffect } from "react";
import { ReactComponent as SvgIcon } from "../../../assets/icon.svg";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import useGroup from "../../../hooks/group/useGroup";
import {
    ArrowBack,
    ExitToApp,
    ExitToAppOutlined,
    ExitToAppRounded,
    ExtensionOff,
    Home,
    Logout,
    Settings
} from "@mui/icons-material";
import {
    getGroupSettingsUrl,
    getGroupUrl,
    GROUP_SETTINGS_URL,
    routesPaths,
    useSmartNavigate
} from "../../../routes";
import { usePermission } from "../../../hooks/auth/usePermission";
import useAuth from "../../../hooks/auth/useAuth";

const Container = styled(Box)(({ theme }) => ({
    width: 56,
    backgroundColor: "#2f2f2f",
    height: "100%",
    color: "white",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",

    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    displayPrint: "none"
}));

const IconContainer = styled(Box)(({ theme }) => ({
    width: 56,
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    "&:hover": {
        filter: "drop-shadow(4px 4px 4px #00000022)",
        transform: "scale(108%)"
    },
    "&:active": {
        transform: "scale(98%)"
    },
    displayPrint: "none"
}));

interface SideToolbarProps {
    component?: ReactElement;
    children?: ReactElement;
}

export default function SideToolbar({ component, children }: SideToolbarProps) {
    const navigate = useSmartNavigate();
    const nvt = useNavigate();

    const onSettings = !!useMatch(GROUP_SETTINGS_URL);

    const { isOn, url, turnOff, name, guid } = useGroup();
    const isOwner = usePermission("GROUP_OWNER", guid);

    const leave = () => {
        turnOff();
        navigate("home");
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row"
                }}>
                <Box displayPrint={"none"}>
                    <Container>
                        <Box
                            flex={1}
                            display={"flex"}
                            flexDirection={"column"}
                            justifyContent={"end"}
                            marginBottom={2}
                            displayPrint={"none"}
                            color={"white"}>
                            {component}

                            {isOwner && (
                                <>
                                    <Tooltip
                                        title={"Zpět na stránku skupiny"}
                                        placement="right">
                                        <IconButton
                                            disabled={!onSettings}
                                            color={"inherit"}
                                            onClick={() =>
                                                nvt(getGroupUrl(name))
                                            }>
                                            <ArrowBack />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip
                                        title={"Spravovat skupinu"}
                                        placement="right">
                                        <IconButton
                                            disabled={onSettings}
                                            color={"inherit"}
                                            onClick={() =>
                                                nvt(getGroupSettingsUrl(name))
                                            }>
                                            <Settings />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )}

                            <Tooltip
                                title={"Opustit mód " + name}
                                placement="right">
                                <IconButton color={"inherit"} onClick={leave}>
                                    <Home />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Container>
                    <Box width={56} displayPrint={"none"} />
                </Box>
                <Box flex={1} minHeight={"calc(100vh - 56px)"}>
                    {children}
                </Box>
            </Box>
        </>
    );
}

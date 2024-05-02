import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    LinearProgress,
    Paper,
    Skeleton,
    Typography,
    styled
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Gap from "../../components/Gap";
import SidePanel from "./components/LeftPanel/SidePanel";
import RightPanel from "./components/RightPanel/RightPanel";
import useInnerPlaylist, {
    InnerPlaylistProvider
} from "./hooks/useInnerPlaylist";
import AppLayout from "../../components/app/AppLayout/AppLayout";
import useAuth from "../../hooks/auth/useAuth";
import { PlaylistItem } from "./components/PlaylistItem";
import { useWindowTitle } from "../../hooks/useWindowTitle";

const Container = styled(Box)(({ theme }) => ({
    padding: 30
}));

export default function PlaylistPreview() {
    const { playlist, items, guid, loading } = useInnerPlaylist();
    const { isLoggedIn, user } = useAuth();

    const isOwner = useMemo(() => {
        if (!playlist || !user) return false;
        if (!isLoggedIn()) return false;
        // return true;
        console.log(playlist.ownerGuid, user.guid);
        return playlist.ownerGuid === user.guid;
    }, [playlist, user]);

    const onSearchClick = () => {
        window.dispatchEvent(new Event("searchBarFocus"));
    };

    useWindowTitle(playlist?.title || "Playlist");

    return (
        <AppLayout>
            <Box display={"flex"} flexDirection={"row"}>
                <SidePanel />

                {loading ? (
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 2
                        }}>
                        <LinearProgress
                            sx={{
                                flex: 1
                            }}
                            color="inherit"
                        />
                    </Box>
                ) : (
                    <>
                        {
                            <Container flex={1}>
                                {items.length == 0 && (
                                    <Box
                                        display={"flex"}
                                        flexDirection={"column"}>
                                        <Typography variant="subtitle1">
                                            V playlistu namáš zatím jedinou
                                            píseň.
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            Aby jsi mohl přidat píseň do
                                            playlistu, je třeba nejdřív nějakou
                                            najít...
                                        </Typography>
                                        <Gap />
                                        <Box>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={onSearchClick}>
                                                Hledat
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                                {items.map((item) => {
                                    return (
                                        <PlaylistItem
                                            item={item}
                                            key={item.guid}
                                        />
                                    );
                                })}
                            </Container>
                        }

                        {isOwner && (
                            <Box
                                displayPrint={"none"}
                                display={{
                                    md: "none",
                                    lg: "block"
                                }}>
                                <RightPanel playlist={playlist} />
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </AppLayout>
    );
}

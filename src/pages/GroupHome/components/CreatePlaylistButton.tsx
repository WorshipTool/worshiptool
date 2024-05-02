import { Box, Typography, styled } from "@mui/material";
import React from "react";
import usePlaylists from "../../../hooks/playlist/usePlaylists";
import useCurrentPlaylist from "../../../hooks/playlist/useCurrentPlaylist";
import { useSmartNavigate } from "../../../routes";

const Container = styled(Box)(({ theme }) => ({
    background: `linear-gradient(2800deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    height: 80,
    borderRadius: 10,
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: `0px 4px 4px #00000040`,
    transition: "all ease 0.2s",
    "&:hover": {
        boxShadow: "0px 0px 4px #00000040",
        filter: "brightness(90%)",
        transform: "scale(101%)"
    }
}));

export default function CreatePlaylistButton() {
    const { createPlaylist } = usePlaylists();
    const { turnOn } = useCurrentPlaylist();

    const navigate = useSmartNavigate();

    const onClick = () => {
        createPlaylist().then((r) => {
            const guid = r.guid;
            turnOn(guid);
            navigate("playlist", { params: { guid } });
        });
    };
    return (
        <Container onClick={onClick}>
            <Typography
                variant="h6"
                fontWeight={900}
                sx={{ userSelect: "none" }}>
                Vytvořit playlist
            </Typography>
        </Container>
    );
}

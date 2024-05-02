import { Box, Button, Typography } from "@mui/material";
import React from "react";
import UploadedSongLink from "./components/UploadedSongLink";
import Gap from "../../../../../../components/Gap";

interface UploadedSongListProps {
    songs: {
        title: string;
        guid: string;
    }[];
}

export default function UploadedSongList(props: UploadedSongListProps) {
    return (
        <Box
            sx={{
                padding: 2
            }}>
            <Typography variant="h5">Nahrané písně</Typography>
            <Gap />

            {props.songs.map((song, index) => {
                return (
                    <div key={song.guid}>
                        <UploadedSongLink
                            title={song.title}
                            guid={song.guid}
                            index={index + 1}
                        />
                    </div>
                );
            })}
        </Box>
    );
}

import React from "react";
import Song from "../../../interfaces/song/song";
import { Box, Chip, Typography } from "@mui/material";
import { MediaTypes } from "../../../interfaces/song/media";
import YoutubeVideo from "../../../common/components/YoutubeVideo";
import { VariantDTO } from "../../../interfaces/variant/VariantDTO";
import { SourceTypes } from "../../../interfaces/song/source";
import useAuth from "../../../hooks/auth/useAuth";
import { SongDto, SongVariantDto } from "../../../api/dtos";
import { SourcesList } from "./SourcesList/SourcesList";

interface AdditionalSongInfoPanelProps {
    song: SongDto;
    variant: SongVariantDto;
}

export default function AdditionalSongInfoPanel({
    song,
    variant
}: AdditionalSongInfoPanelProps) {
    const { isAdmin, isLoggedIn } = useAuth();
    return (
        <Box sx={{}}>
            {/* VIDEOS */}
            {isLoggedIn() ? (
                <>
                    {song.media.map((m) => {
                        if (m.type === MediaTypes.Youtube) {
                            return (
                                <YoutubeVideo
                                    src={m.url}
                                    key={m.url}></YoutubeVideo>
                            );
                        } else {
                            return (
                                <Typography>
                                    Našli jsme přílohu, ale nevíme jak si s ní
                                    poradit.
                                </Typography>
                            );
                        }
                    })}
                </>
            ) : (
                <></>
            )}
            {variant.sources?.length > 0 && (
                <SourcesList variant={variant as SongVariantDto} />
            )}
            <Box>
                {/* RESOURCES */}

                {isAdmin() ? (
                    <>
                        {/* TAGS */}
                        {song.tags.length > 0 && (
                            <>
                                <Typography variant="subtitle2">
                                    Tagy
                                </Typography>
                                <Box
                                    display={"flex"}
                                    flexDirection={"row"}
                                    flexWrap={"wrap"}
                                    gap={0.5}>
                                    {song.tags.map((s) => {
                                        return <Chip label={s} key={s} />;
                                    })}
                                </Box>
                            </>
                        )}

                        {/* CREATORS */}
                        {variant.creators.length > 0 && (
                            <>
                                <Typography variant="subtitle2">
                                    Autoři
                                </Typography>
                                <Box
                                    display={"flex"}
                                    flexDirection={"row"}
                                    gap={0.5}>
                                    {variant.creators.map((s) => {
                                        return (
                                            <Chip label={s.name} key={s.name} />
                                        );
                                    })}
                                </Box>
                            </>
                        )}
                    </>
                ) : (
                    <></>
                )}
            </Box>
        </Box>
    );
}

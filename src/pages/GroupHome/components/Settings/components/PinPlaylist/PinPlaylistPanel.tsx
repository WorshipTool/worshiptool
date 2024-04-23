import { PushPin } from "@mui/icons-material";
import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import Card from "../../../../../../components/Card/Card";
import useGroup from "../../../../../../hooks/group/useGroup";
import PinnedPlaylist from "./PinnedPlaylist";
import Gap from "../../../../../../components/Gap";
import { getSmartParams, routesPaths } from "../../../../../../routes";

export default function PinPlaylistPanel() {
    const { payload, setPayload } = useGroup();

    const [pinnedPlaylist, setPinnedPlaylist] = React.useState<string | null>(
        payload.pinnedPlaylist || null
    );

    useEffect(() => {
        setPinnedPlaylist(payload.pinnedPlaylist || null);
    }, [payload.pinnedPlaylist]);

    const [choosing, setChoosing] = React.useState(false);

    const [value, setValue] = useState("");
    const [error, setError] = useState<string | null>(null);

    const onPinClick = () => {
        // setChoosing(false);
        const params = getSmartParams(value, routesPaths.playlist);
        const playlistGuid = params.guid;

        if (!playlistGuid) {
            setError("Neplatná url playlistu.");
            return;
        }

        setPayload({
            pinnedPlaylist: playlistGuid
        }).then(() => {
            setPinnedPlaylist(playlistGuid);
            setChoosing(false);
        });
    };

    const onRemoveClick = () => {
        setPayload({
            pinnedPlaylist: null
        }).then(() => {
            setPinnedPlaylist(null);
        });
    };

    return (
        <Card
            title="Připnout playlist"
            icon={<PushPin />}
            sx={{
                position: "relative"
            }}>
            {/* <Button
                size="small"
                sx={{
                    position: "absolute",
                    right: 15,
                    top: 15
                }}>
                Upravit
            </Button> */}
            <Box>
                {pinnedPlaylist ? (
                    <>
                        <PinnedPlaylist
                            guid={pinnedPlaylist}
                            onRemove={onRemoveClick}
                        />
                    </>
                ) : (
                    <Box
                        display={"flex"}
                        sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}>
                        {!choosing ? (
                            <>
                                <Typography>
                                    Zatím nemáte připnutý žádný playlist.
                                </Typography>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => setChoosing(true)}>
                                    Zvolit playlist
                                </Button>
                            </>
                        ) : (
                            <Box>
                                <Typography variant="body1">
                                    Zadejte, prosím, url playlistu, který chcete
                                    připnout.
                                </Typography>
                                <Gap />
                                <Box display={"flex"} gap={1}>
                                    <TextField
                                        size="small"
                                        placeholder="Url playlistu"
                                        value={value}
                                        onChange={(e) =>
                                            setValue(e.target.value)
                                        }
                                        helperText={error}
                                        error={!!error}
                                    />
                                    <Button onClick={onPinClick}>
                                        Připnout
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </Card>
    );
}

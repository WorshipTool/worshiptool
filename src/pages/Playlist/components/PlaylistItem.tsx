import React, { useEffect, useMemo } from "react";
import useSong from "../../../hooks/song/useSong";
import useInnerPlaylist from "../hooks/useInnerPlaylist";
import useCurrentPlaylist from "../../../hooks/playlist/useCurrentPlaylist";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Chip,
    IconButton,
    Paper,
    Skeleton,
    Typography
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import DefaultStyle from "../../../components/SheetDisplay/styles/DefaultStyle";
import { PlaylistItemDTO } from "../../../interfaces/playlist/PlaylistDTO";

import { Sheet } from "@pepavlin/sheet-api";
import useAuth from "../../../hooks/auth/useAuth";
import { LoadingButton } from "@mui/lab";
import { getVariantUrl } from "../../../routes/routes";

const PageBreak = () => {
    return (
        <Box
            sx={{
                pageBreakAfter: "always"
            }}></Box>
    );
};

interface PlaylistItemProps {
    item: PlaylistItemDTO;
    reload: () => void;
}

export const PlaylistItem = ({ item, reload }: PlaylistItemProps) => {
    const {
        removeVariant,
        items,
        playlist,
        guid: playlistGuid,
        loading,
        setItemsKeyChord,
        isOwner
    } = useInnerPlaylist();
    const { turnOn } = useCurrentPlaylist();

    const [sheet, setSheet] = React.useState<Sheet>(
        new Sheet(item.variant.sheetData)
    );
    const [number, setNumber] = React.useState(0);

    const { user, isLoggedIn } = useAuth();

    const [removing, setRemoving] = React.useState(false);
    const [saving, setSaving] = React.useState(0);

    const onRemove = async () => {
        setRemoving(true);
        const result = await removeVariant(item.variant.guid);
        setRemoving(false);

        turnOn(playlistGuid);
    };

    const transpose = async (value: number) => {
        setSaving((s) => s + 1);
        sheet.transpose(value);
        rerender();

        if (isOwner) {
            const c = sheet.getKeyChord();
            if (c) await setItemsKeyChord(item, c);
        }
        setSaving((s) => s - 1);
    };

    const navigate = useNavigate();

    const open = () => {
        navigate(getVariantUrl(item.variant.alias), {
            state: {
                title: item.variant.preferredTitle
            }
        });
    };

    const rerender = () => {
        setNumber((prev) => prev + 1);
    };

    useEffect(() => {
        sheet.setKey(item.toneKey);
        rerender();
    }, [item]);

    if (loading)
        return (
            <>
                <Skeleton variant="text" width={"50%"}></Skeleton>
                {Array(10)
                    .fill(0)
                    .map(() => (
                        <Skeleton
                            variant="text"
                            width={
                                Math.round(Math.random() * 40) + "%"
                            }></Skeleton>
                    ))}
            </>
        );
    return (
        <>
            <Paper sx={{ padding: 2, marginBottom: 1, displayPrint: "none" }}>
                <Box
                    position={"absolute"}
                    marginTop={-13}
                    id={"playlistItem_" + item.guid}></Box>

                <Box
                    display={"flex"}
                    flexDirection={"row"}
                    justifyContent={"space-between"}>
                    {isOwner ? (
                        <Box>
                            <IconButton
                                onClick={() => {
                                    transpose(1);
                                }}>
                                <Add />
                            </IconButton>
                            <IconButton
                                onClick={() => {
                                    transpose(-1);
                                }}>
                                <Remove />
                            </IconButton>
                        </Box>
                    ) : (
                        <Box />
                    )}

                    {saving > 0 && (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "start",
                                paddingLeft: 1
                            }}
                            flex={1}>
                            <Typography variant="subtitle2">
                                Ukládání...
                            </Typography>
                        </Box>
                    )}

                    <Box display={"flex"} flexDirection={"row"}>
                        {isOwner && (
                            <LoadingButton
                                loading={removing}
                                variant="text"
                                color="error"
                                onClick={onRemove}>
                                Odebrat z playlistu
                            </LoadingButton>
                        )}
                        <Button variant="text" onClick={open}>
                            Otevřít
                        </Button>
                    </Box>
                </Box>

                <DefaultStyle
                    sheet={sheet}
                    title={item.variant.preferredTitle}
                />
            </Paper>

            <Box display={"none"} displayPrint={"block"}>
                <DefaultStyle
                    sheet={sheet}
                    title={item.variant.preferredTitle}
                />
                {items.length > 1 && <PageBreak />}
            </Box>
        </>
    );
};

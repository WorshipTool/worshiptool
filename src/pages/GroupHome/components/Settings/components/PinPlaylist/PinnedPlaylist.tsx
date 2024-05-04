import { Box, Button, LinearProgress, Typography } from "@mui/material";
import React from "react";
import usePlaylists from "../../../../../../hooks/playlist/usePlaylists";
import { useApiStateEffect } from "../../../../../../tech/ApiState";
import { handleApiCall } from "../../../../../../tech/handleApiCall";
import { SkeletonLoader } from "../../../../../../common/providers/SkeletonLoader";
import { LoadingButton } from "@mui/lab";

type PinnedPlaylistProps = {
    guid: string;
    onRemove: () => void;
    onTryAgain: () => void;
    loading: boolean;
};

export default function PinnedPlaylist(props: PinnedPlaylistProps) {
    const { getPlaylistByGuid } = usePlaylists();
    const [state] = useApiStateEffect(async () => {
        return await getPlaylistByGuid(props.guid);
    }, [props.guid]);

    return (
        <Box
            sx={{
                padding: 1,
                bgcolor: "grey.200"
            }}>
            <SkeletonLoader
                data={[state]}
                render={() => (
                    <Box
                        display={"flex"}
                        flexDirection={"row"}
                        justifyContent={"space-between"}>
                        <Box>
                            <Typography variant="subtitle2">
                                Aktualně připnutý playlist
                            </Typography>
                            <Typography>{state.data?.title}</Typography>
                        </Box>
                        <LoadingButton
                            loading={props.loading}
                            variant="text"
                            size="small"
                            color="error"
                            onClick={props.onRemove}>
                            Odebrat
                        </LoadingButton>
                    </Box>
                )}
                renderLoading={() => <LinearProgress />}
                renderError={() => (
                    <Box display={"flex"} alignItems={"center"} gap={1}>
                        <Typography>Playlist nebyl nalezen</Typography>
                        <LoadingButton
                            size="small"
                            onClick={props.onTryAgain}
                            loading={props.loading}>
                            Připnout jiný
                        </LoadingButton>
                    </Box>
                )}
            />
        </Box>
    );
}

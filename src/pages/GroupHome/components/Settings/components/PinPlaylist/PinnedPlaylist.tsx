import { Box, Button, Typography } from "@mui/material";
import React from "react";
import usePlaylists from "../../../../../../hooks/playlist/usePlaylists";
import { useApiStateEffect } from "../../../../../../tech/ApiState";
import { handleApiCall } from "../../../../../../tech/handleApiCall";
import { SkeletonLoader } from "../../../../../../components/SkeletonLoader";

type PinnedPlaylistProps = {
    guid: string;
    onRemove: () => void;
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
                        <Button
                            variant="text"
                            size="small"
                            color="error"
                            onClick={props.onRemove}>
                            Odebrat
                        </Button>
                    </Box>
                )}
            />
        </Box>
    );
}

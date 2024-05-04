import { Add, Edit, PinDrop, PushPin, Search } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useState } from "react";
import useGroup from "../../../../hooks/group/useGroup";
import useCurrentPlaylist from "../../../../hooks/playlist/useCurrentPlaylist";
import usePlaylists from "../../../../hooks/playlist/usePlaylists";
import GroupToolbarActionButton from "./GroupToolbarActionButton";
import { useApiStateEffect } from "../../../../tech/ApiState";
import { useSmartNavigate } from "../../../../routes";

interface QuickActionsProps {
    visible?: boolean;
}

export default function QuickActions({ visible }: QuickActionsProps) {
    const { createPlaylist, getPlaylistByGuid } = usePlaylists();
    const { turnOn, isOn, guid, playlist } = useCurrentPlaylist();

    const navigate = useSmartNavigate();

    const { guid: groupGuid, payload } = useGroup();

    const pinnedPlaylistGuid = payload?.pinnedPlaylist;
    const [pinnedState] = useApiStateEffect(async () => {
        if (!pinnedPlaylistGuid) return;
        return await getPlaylistByGuid(pinnedPlaylistGuid);
    }, [pinnedPlaylistGuid]);

    const [createSongLoading, setCreateSongLoading] = useState(false);
    const [createPlaylistLoading, setCreatePlaylistLoading] = useState(false);

    const onCreatePlaylist = () => {
        setCreatePlaylistLoading(true);
        createPlaylist().then((r) => {
            const guid = r.guid;
            turnOn(guid);
            navigate("playlist", {
                params: { guid }
            });
            setCreatePlaylistLoading(false);
        });
    };

    const onSearchSong = () => {
        window.dispatchEvent(new Event("searchBarFocus"));
    };

    const openPlaylistToEdit = () => {
        navigate("playlist", { params: { guid } });
    };

    const openPinnedPlaylist = () => {
        if (!pinnedState.data) return;
        navigate("playlist", { params: { guid: pinnedState.data.guid } });
    };

    return (
        <Box>
            <Box display={"flex"} flexDirection={"row"} gap={1}>
                <GroupToolbarActionButton
                    label="Vytvořit playlist"
                    variant="primary"
                    icon={
                        <Add
                            sx={{
                                strokeWidth: 2
                            }}
                        />
                    }
                    onClick={onCreatePlaylist}
                    visible={visible}
                    id={0}
                    loading={createPlaylistLoading}
                />
                <GroupToolbarActionButton
                    label="Vyhledat píseň"
                    icon={
                        <Search
                            sx={{
                                strokeWidth: 1
                            }}
                        />
                    }
                    onClick={onSearchSong}
                    visible={visible}
                    id={1}
                />
                {/* <GroupToolbarActionButton
                    label="Vytvořit novou píseň"
                    icon={
                        <Add
                            sx={{
                                strokeWidth: 2
                            }}
                        />
                    }
                    onClick={onNewSong}
                    visible={visible}
                    id={2}
                    loading={createSongLoading}
                /> */}
                {pinnedState.data && (
                    <>
                        <GroupToolbarActionButton
                            label={pinnedState.data?.title}
                            secondaryLabel="Připnuté"
                            variant="secondary"
                            icon={<PushPin />}
                            onClick={openPinnedPlaylist}
                            visible={visible}
                            id={4}
                        />
                    </>
                )}
                {isOn ? (
                    <GroupToolbarActionButton
                        label="Editovat playlist"
                        secondaryLabel={playlist?.title}
                        variant="secondary"
                        icon={<Edit></Edit>}
                        onClick={openPlaylistToEdit}
                        visible={visible}
                        id={3}
                    />
                ) : (
                    <></>
                )}
            </Box>
        </Box>
    );
}

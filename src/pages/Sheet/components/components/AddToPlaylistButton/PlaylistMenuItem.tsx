import {
    CheckCircle,
    Launch,
    OpenInBrowser,
    PlaylistAdd
} from "@mui/icons-material";
import {
    Box,
    CircularProgress,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    MenuItem
} from "@mui/material";
import React, { useEffect } from "react";
import { PostAddVariantToPlaylistBodyDTO } from "../../../../../api/dtos/playlist/dtosPlaylist";
import { VariantDTO } from "../../../../../interfaces/variant/VariantDTO";
import usePlaylists from "../../../../../hooks/playlist/usePlaylists";
import { SongVariantDto } from "../../../../../api/dtos";
import Gap from "../../../../../components/Gap";
import { useNavigate } from "react-router-dom";

interface PlaylistMenuItemProps {
    variant: SongVariantDto;
    guid: string;
    title: string;
}

export default function PlaylistMenuItem({
    variant,
    guid,
    title
}: PlaylistMenuItemProps) {
    const {
        addVariantToPlaylist: addToPlaylist,
        removeVariantFromPlaylist: removeFromPlaylist
    } = usePlaylists();
    const { isVariantInPlaylist } = usePlaylists();

    const [loading, setLoading] = React.useState(true);
    const [isInPlaylist, setIsInPlaylist] = React.useState<boolean>(false);

    useEffect(() => {
        if (variant) {
            setLoading(true);
            isVariantInPlaylist(variant.guid, guid).then((r) => {
                setIsInPlaylist(r);
                setLoading(false);
            });
        }
    }, [variant]);

    const reloadPlaylists = () => {
        return isVariantInPlaylist(variant.guid, guid).then((r) => {
            setIsInPlaylist(r);
        });
    };

    const addVariantToPlaylist = (guid: string) => {
        setLoading(true);

        try {
            addToPlaylist(variant.alias, guid).then(async (result) => {
                await reloadPlaylists();
                setLoading(false);
            });
        } catch (e) {
            console.log(e);
        }
    };

    const removeVariantFromPlaylist = (guid: string) => {
        setLoading(true);

        try {
            removeFromPlaylist(variant.alias, guid).then(async (result) => {
                await reloadPlaylists();
                setLoading(false);
            });
        } catch (e) {
            console.log(e);
        }
    };
    const navigate = useNavigate();
    const openPlaylist = () => {
        // navigate(`/playlist/${guid}`);
        window.open(`/playlist/${guid}`, "_blank");
    };

    return (
        <MenuItem key={guid + "pl"} disabled={loading}>
            <Box
                onClick={() => {
                    if (!isInPlaylist) addVariantToPlaylist(guid);
                    else removeVariantFromPlaylist(guid);
                }}
                sx={{
                    flexDirection: "row",
                    display: "flex"
                }}>
                <ListItemIcon
                    sx={{
                        height: "10px",
                        marginTop: "2px"
                    }}>
                    {loading ? (
                        <CircularProgress size={"1rem"} color="inherit" />
                    ) : !isInPlaylist ? (
                        <PlaylistAdd fontSize="small" />
                    ) : (
                        <CheckCircle fontSize="small" />
                    )}
                </ListItemIcon>

                <ListItemText primary={title} />
            </Box>
            <Gap horizontal value={1} />
            <IconButton
                onClick={openPlaylist}
                size="small"
                sx={{
                    marginY: "-5px",
                    marginX: "-4px",
                    transform: "scale(0.8)"
                }}>
                <Launch fontSize="small" />
            </IconButton>
        </MenuItem>
    );
}

import { CheckCircle, PlaylistAdd } from "@mui/icons-material";
import {
    CircularProgress,
    ListItemIcon,
    ListItemText,
    MenuItem
} from "@mui/material";
import { SkeletonLoader } from "../../../../../components/SkeletonLoader";
import { useGroups } from "../../../../../hooks/group/useGroups";
import usePlaylists from "../../../../../hooks/playlist/usePlaylists";
import { useApiState, useApiStateEffect } from "../../../../../tech/ApiState";
import { useSnackbar } from "notistack";

type GroupItemProps = {
    groupGuid: string;
    variantAlias: string;
};
export default function GroupItem(props: GroupItemProps) {
    const groups = useGroups();
    const [groupState] = useApiStateEffect(async () => {
        return groups.getInfoByGuid(props.groupGuid);
    }, [props.groupGuid]);

    const selection = usePlaylists();

    const [isInState, reload] = useApiStateEffect(async () => {
        if (!groupState.data?.selection) return false;
        return selection.isVariantInPlaylist(
            props.variantAlias || "",
            groupState.data?.selection || ""
        );
    }, [groupState]);

    const { enqueueSnackbar } = useSnackbar();

    const { apiState: addingState, fetchApiState } = useApiState();

    const addToSelection = () => {
        fetchApiState(() =>
            selection
                .addVariantToPlaylist(
                    props.variantAlias,
                    groupState.data?.selection || ""
                )
                .then(() => {
                    reload();
                    enqueueSnackbar("Přidáno do skupiny");
                })
        );
    };

    const removeFromSelection = () => {
        fetchApiState(() =>
            selection
                .removeVariantFromPlaylist(
                    props.variantAlias,
                    groupState.data?.selection || ""
                )
                .then(() => {
                    reload();
                    enqueueSnackbar("Odebráno ze skupiny");
                })
        );
    };

    const handleClick = () => {
        if (!groupState.data) return;
        if (isInState.data) {
            removeFromSelection();
        } else {
            addToSelection();
        }
    };

    return (
        <MenuItem onClick={handleClick}>
            <SkeletonLoader
                data={[groupState, isInState]}
                render={() => {
                    return (
                        <>
                            <ListItemIcon>
                                {addingState.loading ? (
                                    <CircularProgress
                                        size={"1rem"}
                                        color="inherit"
                                    />
                                ) : !isInState.data ? (
                                    <PlaylistAdd fontSize="small" />
                                ) : (
                                    <CheckCircle fontSize="small" />
                                )}
                            </ListItemIcon>
                            <ListItemText primary={groupState.data?.name} />
                        </>
                    );
                }}
                renderLoading={() => {
                    return <CircularProgress size={"1rem"} color="inherit" />;
                }}
            />
        </MenuItem>
    );
}

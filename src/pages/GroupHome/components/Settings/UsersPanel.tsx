import React, { useMemo, useState } from "react";
import { usePermissions } from "../../../../hooks/auth/usePermissions";
import { useApiStateEffect } from "../../../../tech/ApiState";
import useGroup from "../../../../hooks/group/useGroup";
import {
    Box,
    Button,
    IconButton,
    LinearProgress,
    Typography
} from "@mui/material";
import { SkeletonLoader } from "../../../../common/providers/SkeletonLoader";
import GroupUserItem from "./components/GroupUserItem";
import Gap from "../../../../common/ui/Gap/Gap";
import AddUserItem from "./components/AddUserItem";
import { Add } from "@mui/icons-material";

export default function UsersPanel() {
    const { guid } = useGroup();
    const { getUsersWithPermission } = usePermissions();

    const [addUsersState, reload1] = useApiStateEffect(
        () => getUsersWithPermission("GROUP_ADD_SONG", guid),
        []
    );
    const [removeUsersState, reload2] = useApiStateEffect(
        () => getUsersWithPermission("GROUP_REMOVE_SONG", guid),
        []
    );

    const loading = useMemo(() => {
        return addUsersState.loading || removeUsersState.loading;
    }, [addUsersState.loading, removeUsersState.loading]);

    const [addingAddUser, setAddingAddUser] = useState(false);
    const [addingRemoveUser, setAddingRemoveUser] = useState(false);

    const reload = () => {
        reload1();
        reload2();

        setAddingAddUser(false);
        setAddingRemoveUser(false);
    };
    const [editable, setEditable] = useState(false);
    const onEditClick = () => {
        setEditable(true);
    };

    const onSaveClick = () => {
        setEditable(false);
        setAddingAddUser(false);
        setAddingRemoveUser(false);
    };

    return (
        <Box>
            <Box
                display={"flex"}
                alignItems={"center"}
                flexDirection={"row"}
                justifyContent={"space-between"}>
                <Box>
                    <Typography variant="subtitle1">
                        Uživatelé, kteří...
                    </Typography>
                </Box>
                {editable ? (
                    <Button size="small" onClick={onSaveClick} color="primary">
                        Hotovo
                    </Button>
                ) : (
                    <Button size="small" onClick={onEditClick}>
                        Upravit
                    </Button>
                )}
            </Box>
            <SkeletonLoader
                data={[addUsersState, removeUsersState]}
                renderLoading={() => <LinearProgress />}
                render={() => (
                    <>
                        <Gap value={1} />
                        <Typography variant="subtitle2">
                            Mohou přidávat písně
                        </Typography>
                        <Gap />
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                gap: 1
                            }}>
                            {addUsersState.data?.map((u) => (
                                <GroupUserItem
                                    key={u.guid}
                                    user={u}
                                    editable={editable}
                                    onRemove={reload}
                                    permissionType="GROUP_ADD_SONG"
                                    permissionPayload={guid}
                                />
                            ))}

                            {!editable ? (
                                <></>
                            ) : !addingAddUser ? (
                                <IconButton
                                    size="small"
                                    onClick={() => setAddingAddUser(true)}>
                                    <Add />
                                </IconButton>
                            ) : (
                                <AddUserItem
                                    permissionType="GROUP_ADD_SONG"
                                    permissionPayload={guid}
                                    onAdd={reload}
                                    loading={loading}
                                />
                            )}

                            {!editable && addUsersState.data?.length == 0 && (
                                <Typography variant="body2">
                                    Kromě vás zatím nikdo nemůže přidávat nové
                                    písně...
                                </Typography>
                            )}
                        </Box>
                        <Gap value={3} />
                        <Typography variant="subtitle2">
                            Mohou odebírat písně
                        </Typography>
                        <Gap />
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 1,
                                flexWrap: "wrap"
                            }}>
                            {removeUsersState.data?.map((u) => (
                                <GroupUserItem
                                    key={u.guid}
                                    user={u}
                                    editable={editable}
                                    onRemove={reload}
                                    permissionType="GROUP_REMOVE_SONG"
                                    permissionPayload={guid}
                                />
                            ))}
                            {!editable &&
                                removeUsersState.data?.length == 0 && (
                                    <Typography variant="body2">
                                        Kromě vás zatím nikdo nemůže odebírat
                                        písně...
                                    </Typography>
                                )}

                            {!editable ? (
                                <></>
                            ) : !addingRemoveUser ? (
                                <IconButton
                                    size="small"
                                    onClick={() => setAddingRemoveUser(true)}>
                                    <Add />
                                </IconButton>
                            ) : (
                                <AddUserItem
                                    permissionType="GROUP_REMOVE_SONG"
                                    permissionPayload={guid}
                                    onAdd={reload}
                                    loading={loading}
                                />
                            )}
                        </Box>
                    </>
                )}
            />
        </Box>
    );
}

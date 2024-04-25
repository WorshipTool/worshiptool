import {
    Avatar,
    Box,
    Button,
    Divider,
    IconButton,
    NativeSelect,
    Select,
    Typography
} from "@mui/material";
import React from "react";
import { BaseUserInfoOutDto } from "../../../../../api/generated";
import { Close, Delete, Remove } from "@mui/icons-material";
import CustomChip from "../../../../../components/CustomChip/CustomChip";
import { useUserProfileImage } from "../../../../../hooks/useUserProfileImage";
import { useApi } from "../../../../../hooks/api/useApi";
import { useApiState } from "../../../../../tech/ApiState";
import { handleApiCall } from "../../../../../tech/handleApiCall";
import {
    PermissionPayloadType,
    PermissionType
} from "../../../../../interfaces/permission.types";
import { permissionPayloadToApi } from "../../../../../api/dtos/permission";

type GroupUserItemProps<T extends PermissionType> = {
    user: BaseUserInfoOutDto;
    editable?: boolean;
    onRemove: () => void;
    permissionType: T;
    permissionPayload: PermissionPayloadType<T>;
};

export default function GroupUserItem<T extends PermissionType>(
    props: GroupUserItemProps<T>
) {
    const imageUrl = useUserProfileImage(props.user.guid);

    const { permissionApi } = useApi();
    const { apiState, fetchApiState } = useApiState();

    const onRemoveClick = () => {
        fetchApiState(
            async () => {
                const permission = await handleApiCall(
                    permissionApi.permissionControllerGetOrAddPermission({
                        type: props.permissionType,
                        payload: permissionPayloadToApi(props.permissionPayload)
                    })
                );

                return await handleApiCall(
                    permissionApi.permissionControllerRemovePermissionFromUser({
                        userGuid: props.user.guid,
                        permissionGuid: permission.guid
                    })
                );
            },
            () => {
                props.onRemove();
            }
        );
    };

    return (
        <Box
            sx={{
                bgcolor: "grey.200",
                padding: 1,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "grey.300",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1
            }}>
            <Avatar
                src={imageUrl}
                sx={{
                    width: 25,
                    height: 25
                }}
            />
            <Typography>
                {props.user.firstName + " " + props.user.lastName}
            </Typography>
            {props.editable && (
                <>
                    <Divider orientation="vertical" flexItem />
                    <IconButton
                        onClick={onRemoveClick}
                        size="small"
                        sx={{
                            margin: -1
                        }}>
                        <Close color="error" fontSize="small" />
                    </IconButton>
                </>
            )}
        </Box>
    );
}

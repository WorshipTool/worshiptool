import { Box, Input, LinearProgress } from "@mui/material";
import React from "react";
import FoundUser from "./FoundUser";
import { useApiState, useApiStateEffect } from "../../../../../tech/ApiState";
import { useApi } from "../../../../../hooks/api/useApi";
import {
    PermissionPayloadType,
    PermissionType
} from "../../../../../interfaces/permission.types";
import { handleApiCall } from "../../../../../tech/handleApiCall";

type AddUserItemProps<T extends PermissionType> = {
    permissionType: T;
    permissionPayload: PermissionPayloadType<T>;
    onAdd: () => void;
    loading?: boolean;
};

export default function AddUserItem<T extends PermissionType>(
    props: AddUserItemProps<T>
) {
    const { permissionApi } = useApi();
    const { apiState, fetchApiState } = useApiState();

    const onFoundUser = (userGuid: string) => {
        fetchApiState(
            async () => {
                const permission = await handleApiCall(
                    permissionApi.permissionControllerGetOrAddPermission({
                        type: props.permissionType,
                        payload: props.permissionPayload
                    })
                );

                return handleApiCall(
                    permissionApi.permissionControllerAddPermissionToUser({
                        userGuid: userGuid,
                        permissionGuid: permission.guid
                    })
                );
            },
            () => {
                props.onAdd();
            }
        );
    };

    return (
        <Box>
            {props.loading ? (
                <LinearProgress />
            ) : (
                <FoundUser onLoad={onFoundUser} />
            )}
        </Box>
    );
}

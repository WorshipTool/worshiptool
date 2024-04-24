import {
    PermissionDataType,
    PermissionPayloadType,
    PermissionType
} from "../../interfaces/permission.types";
import { useApi } from "../api/useApi";
import { useApiStateEffect } from "../../tech/ApiState";
import { handleApiCall } from "../../tech/handleApiCall";
import useAuth from "./useAuth";

export const usePermissions = (userGuid?: string) => {
    const { permissionApi } = useApi();
    const { user, isAdmin, isLoggedIn } = useAuth();
    const [state, reload] = useApiStateEffect<
        PermissionDataType[]
    >(async () => {
        if (!isLoggedIn()) return [];
        const data = await handleApiCall(
            permissionApi.permissionControllerGetUserPermissions(userGuid)
        );
        return data.map((p) => {
            return {
                type: p.type as PermissionType,
                payload: p.payload as PermissionPayloadType<PermissionType>,
                guid: p.guid
            };
        });
    }, [userGuid, isLoggedIn]);

    const getUsersWithPermission = async <T extends PermissionType>(
        type: T,
        payload: PermissionPayloadType<T>
    ) => {
        if (!isLoggedIn()) return [];
        const data = await handleApiCall(
            permissionApi.permissionControllerGetAllUsersWithPermission(
                type,
                payload as any
            )
        );
        return data;
    };

    return {
        reload,
        state: state,
        permissions: state.data || [],
        getUsersWithPermission,
        includesPermission: <T extends PermissionType>(
            type: T,
            payload?: PermissionPayloadType<T>
        ) => {
            if ((!userGuid || user?.guid === userGuid) && isAdmin())
                return true;
            return (
                state.data?.some(
                    (p) =>
                        p.type === type &&
                        (!payload ||
                            JSON.stringify(p.payload) ===
                                JSON.stringify(payload))
                ) || false
            );
        }
    };
};

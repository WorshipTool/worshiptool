import {
    PermissionPayloadType,
    PermissionType
} from "../../interfaces/permission.types";
import { usePermissions } from "./usePermissions";

export const usePermission = <T extends PermissionType>(
    type: T,
    payload: PermissionPayloadType<T>
): boolean => {
    const data = usePermissions();
    return data.includesPermission(type, payload);
};

import { useMemo } from "react";
import {
    PermissionPayloadType,
    PermissionType
} from "../../interfaces/permission.types";
import { usePermissions } from "./usePermissions";

export const usePermission = <T extends PermissionType>(
    type: T,
    payload: PermissionPayloadType<T>
): boolean | null => {
    const data = usePermissions();

    const includes = useMemo(() => {
        return data.state.loading
            ? null
            : data.includesPermission(type, payload);
    }, [data, type, payload]);

    return includes;
};

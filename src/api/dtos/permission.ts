import {
    PermissionPayloadType,
    PermissionType
} from "../../interfaces/permission.types";

export const apiToPermissionPayload = (
    api?: string
): PermissionPayloadType<PermissionType> | undefined => {
    if (!api) return undefined;

    try {
        return JSON.parse(api) as PermissionPayloadType<PermissionType>;
    } catch (e) {
        return api as PermissionPayloadType<PermissionType>;
    }
};

export const permissionPayloadToApi = (
    payload?: PermissionPayloadType<PermissionType>
): string | undefined => {
    if (!payload) return undefined;
    return JSON.stringify(payload);
};

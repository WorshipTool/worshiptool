export const Permissions: Record<keyof PermissionPayloads, string> = {
    GROUP_ADD_SONG: "GROUP_ADD_SONG",
    GROUP_OWNER: "GROUP_OWNER"
};

export type PermissionPayloads = {
    GROUP_ADD_SONG: string;
    GROUP_OWNER: string;
};

export type PermissionType = keyof PermissionPayloads;
export type PermissionPayloadType<T extends keyof PermissionPayloads> =
    PermissionPayloads[T];

export type PermissionDataType<T extends PermissionType = PermissionType> = {
    type: T;
    payload?: PermissionPayloadType<T>;
    guid?: string;
};

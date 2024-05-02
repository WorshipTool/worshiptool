export interface Group {
    name: string;
    code: string;
    guid: string;
    selection: string;
    payload: GroupPayloadType;
}

export type GroupPayloadType = Partial<{
    pinnedPlaylist: string | null;
}>;

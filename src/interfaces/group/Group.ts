export interface Group {
    name: string;
    guid: string;
    selection: string;
    payload: GroupPayloadType;
}

export type GroupPayloadType = Partial<{
    pinnedPlaylist: string | null;
}>;

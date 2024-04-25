import { GroupPayloadType } from "../../interfaces/group/Group";

export const apiToGroupPayload = (api?: string): GroupPayloadType => {
    if (!api) return {};

    try {
        return JSON.parse(api) as GroupPayloadType;
    } catch (e) {
        return api as GroupPayloadType;
    }
};

import { useApi } from "../api/useApi";
import { handleApiCall } from "../../tech/handleApiCall";

export const useGroups = () => {
    const { groupApi } = useApi();

    const getInfoByGuid = async (guid: string) => {
        const d = await handleApiCall(
            groupApi.groupControllerGetGroupInfo(guid)
        );
        return d;
    };

    const getAllGroups = async () => {
        const d = await handleApiCall(groupApi.groupControllerGetGroupsList());
        return d;
    };

    return { getInfoByGuid, getAllGroups };
};

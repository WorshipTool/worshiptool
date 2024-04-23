import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Group, GroupPayloadType } from "../../interfaces/group/Group";
import useAuth from "../auth/useAuth";
import { GroupApi } from "../../api/generated";
import { handleApiCall } from "../../tech/handleApiCall";
import { getGroupUrl, routesPaths } from "../../routes/routes";
import { useSmartNavigate } from "../../routes";

export const groupContext = createContext<useProvideGroupI>(
    {} as useProvideGroupI
);

export default function useGroup() {
    return useContext(groupContext);
}

export const GroupProvider = ({ children }: { children: any }) => {
    const auth = useProvideGroup();

    return (
        <groupContext.Provider value={auth}>{children}</groupContext.Provider>
    );
};

interface useProvideGroupI {
    name: string;
    guid: string;
    selectionGuid: string;
    payload: GroupPayloadType;
    setPayload: (payload: GroupPayloadType) => Promise<void>;
    turnOn: (name: string) => void;
    turnOff: () => void;
    isOn: boolean;
    url: string;
}

export const useProvideGroup = (): useProvideGroupI => {
    // const {fetchData} = useFetch();

    const navigate = useSmartNavigate();

    const [group, setGroup] = useState<Group>();

    const { isLoggedIn, apiConfiguration } = useAuth();
    const groupApi = new GroupApi(apiConfiguration);

    const key = "activeGroup";

    const turnOn = (name: string) => {
        handleApiCall(groupApi.groupControllerGetGroupInfo(undefined, name))
            .then((r) => {
                setGroup(r);
                localStorage.setItem(key, name);
            })
            .catch((e) => {
                console.log(e);
            });
    };
    const turnOff = () => {
        setGroup(undefined);
        localStorage.removeItem(key);

        // TODO: implements better
        if (window.location.pathname.includes("skupina")) {
            navigate("home");
        }
    };

    const setPayload = async (payload: GroupPayloadType) => {
        if (!group) return;
        return await handleApiCall(
            groupApi.groupControllerUpdateGroupPayload({
                guid: group.guid,
                payload
            })
        );
    };

    useEffect(() => {
        if (!isLoggedIn()) return;
        const activeName = localStorage.getItem(key);
        if (!activeName) return;
        turnOn(activeName);
    }, [isLoggedIn]);

    return {
        turnOn,
        turnOff,
        isOn: group !== undefined,
        name: group?.name || "",
        guid: group?.guid || "",
        payload: group?.payload || {},
        setPayload,
        selectionGuid: group?.selection || "",
        url: getGroupUrl(group?.name || "")
    };
};

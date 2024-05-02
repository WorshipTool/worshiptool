import { isMobile, isTablet } from "react-device-detect";
import { useSmartNavigate } from "../../../../../routes";

interface MenuItem {
    title: string;
    image: string;
    action: () => void;
    disabled?: boolean;
}

export const searchGroupsEvent = new Event("searchGroups");

export default function useToolsMenuItems() {
    const navigate = useSmartNavigate();

    const items: MenuItem[] = [
        {
            title: "Playlisty",
            image: "https://cdn-icons-png.flaticon.com/512/636/636224.png",
            action: () => {
                navigate("usersPlaylists", {});
            },
            disabled: isMobile && !isTablet
        },
        {
            title: "Moje",
            image: "https://cdn-icons-png.flaticon.com/512/10627/10627120.png",
            action: () => {
                navigate("usersSongs", {});
            },
            disabled: isMobile && !isTablet
        },

        {
            title: "13ka",
            image: "/static/assets/13ka-icon.png",
            action: () => {
                navigate("group", { params: { groupCode: "13ka" } });
            },
            disabled: isMobile && !isTablet
        },
        {
            title: "Hledat skupinu",
            image: "https://static.thenounproject.com/png/79376-200.png",
            action: () => {
                dispatchEvent(searchGroupsEvent);
            }
        }
    ];

    return {
        items
    };
}

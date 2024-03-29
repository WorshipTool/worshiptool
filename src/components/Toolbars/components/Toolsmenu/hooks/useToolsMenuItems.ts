import { isTablet, isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";


interface MenuItem{
    title: string,
    image: string,
    action: () => void,
    disabled? : boolean
}

export default function useToolsMenuItems(){
    const navigate = useNavigate();

    const items : MenuItem[] = [
        {
            title: "Playlisty",
            image: "https://cdn-icons-png.flaticon.com/512/636/636224.png",
            action: ()=>{
                navigate("/account/playlists")

            },
            disabled: isMobile && !isTablet,
        },
        {
            title: "Moje",
            image: "https://cdn-icons-png.flaticon.com/512/10627/10627120.png",
            action: ()=>{
                navigate("/account/songs")
            },
            disabled: isMobile && !isTablet,
        },
        {
            title: "13ka",
            image: "/static/assets/13ka-icon.png",
            action: ()=>{
                navigate("/group/13ka")
            },
            disabled: isMobile && !isTablet,
        }

    ];
    
    return {
        items
    }
}
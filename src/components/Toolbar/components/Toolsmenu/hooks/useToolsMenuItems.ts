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

            }
        },
        {
            title: "13ka",
            image: "/static/assets/13ka-icon.png",
            action: ()=>{
                navigate("/group/13ka")
            },
            disabled: true
        }

    ];
    
    return {
        items
    }
}
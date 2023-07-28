import { useNavigate, useParams } from "react-router-dom";
import GroupHome from "./GroupHome";
import useGroup, { GroupProvider } from "../../hooks/group/useGroup";
import { useEffect } from "react";
import useAuth from "../../hooks/auth/useAuth";


export default function GroupScreen() {
    const {groupName} = useParams();
    const {turnOn, turnOff, isOn} = useGroup();
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        if(!isLoggedIn()) navigate("/")
    },[isLoggedIn])


    useEffect(()=>{
        if(groupName===undefined) turnOff();
        else{
            turnOn(groupName);
            document.title = "Chval Otce - " + groupName;
        }
    },[groupName])

    return (
        <GroupHome/>
    )
}

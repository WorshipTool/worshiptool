import { useParams } from "react-router-dom";
import GroupHome from "./GroupHome";
import useGroup, { GroupProvider } from "../../hooks/group/useGroup";
import { useEffect } from "react";


export default function GroupScreen() {
    const {groupName} = useParams();
    const {turnOn, turnOff} = useGroup();

    useEffect(()=>{
        if(groupName===undefined) turnOff();
        else turnOn(groupName);
    },[groupName])

    return (
        <GroupHome/>
    )
}

import { useNavigate, useParams } from "react-router-dom";
import GroupHome from "./GroupHome";
import useGroup, { GroupProvider } from "../../hooks/group/useGroup";
import { useEffect } from "react";
import useAuth from "../../hooks/auth/useAuth";
import { useSmartNavigate } from "../../routes/useSmartNavigate";

export default function GroupScreen() {
    const { groupName } = useParams();
    const { turnOn, turnOff, isOn } = useGroup();
    const { isLoggedIn } = useAuth();
    const navigate = useSmartNavigate();

    useEffect(() => {
        if (!isLoggedIn())
            navigate("login", {
                state: {
                    previousPage: window.location.pathname,
                    message: "Pro zobrazení skupiny se musíte přihlásit."
                }
            });
    }, [isLoggedIn]);

    useEffect(() => {
        if (groupName === undefined) turnOff();
        else {
            turnOn(groupName);
            document.title = "Chval Otce - " + groupName;
        }
    }, [groupName]);

    return <GroupHome />;
}

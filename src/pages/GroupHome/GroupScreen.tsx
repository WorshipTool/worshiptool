import GroupHome from "./GroupHome";
import useGroup, { GroupProvider } from "../../hooks/group/useGroup";
import { useEffect } from "react";
import useAuth from "../../hooks/auth/useAuth";
import { useSmartNavigate } from "../../routes/useSmartNavigate.1";
import { useWindowTitle } from "../../hooks/useWindowTitle";
import { useSmartParams } from "../../routes/useSmartParams";

export default function GroupScreen() {
    const { groupCode } = useSmartParams("group");
    const { turnOn, turnOff, isOn, name } = useGroup();
    const { isLoggedIn } = useAuth();
    const navigate = useSmartNavigate();

    useWindowTitle(name);

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
        if (groupCode === undefined) {
            turnOff();
        } else {
            turnOn(groupCode);
        }
    }, [groupCode]);

    return <GroupHome />;
}

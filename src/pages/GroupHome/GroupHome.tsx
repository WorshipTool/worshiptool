import { useEffect } from "react";
import AppLayout from "../../components/app/AppLayout/AppLayout";
import { usePermission } from "../../hooks/auth/usePermission";
import useGroup from "../../hooks/group/useGroup";
import SelectionList from "./components/SelectionList";

export default function GroupHome() {
    const group = useGroup();

    const has = usePermission("GROUP_ADD_SONG", group.guid);

    useEffect(() => {
        window.scroll({
            top: 0,
            behavior: "auto"
        });
    }, []);
    return (
        <AppLayout expandable>
            <SelectionList />
        </AppLayout>
    );
}

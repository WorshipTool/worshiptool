import { useEffect } from "react";
import { Route, Routes, useMatch } from "react-router-dom";
import AppLayout from "../../components/app/AppLayout/AppLayout";
import GroupSettings from "./components/Settings/GroupSettings";
import SelectionList from "./components/SelectionList";
import {
    COMMON_SETTINGS_URL,
    GROUP_SETTINGS_URL,
    routesPaths
} from "../../routes";

export default function GroupHome() {
    // Check if location is home
    const home = useMatch(GROUP_SETTINGS_URL);

    useEffect(() => {
        window.scroll({
            top: 0,
            behavior: "auto"
        });
    }, []);
    return (
        <AppLayout expandable={!home}>
            {/* <SelectionList /> */}
            <Routes>
                <Route path={COMMON_SETTINGS_URL} element={<GroupSettings />} />
                <Route path={"*"} element={<SelectionList />} />
            </Routes>
        </AppLayout>
    );
}

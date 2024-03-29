import React, { useState } from "react";
import TabPanel from "./TabPanel";
import AdminPanel from "../AdminPanel/AdminPanel";
import ChangePassword from "./ChangePassword";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import BasicInfo from "./BasicInfo";
import useAuth from "../../../hooks/auth/useAuth";

export default function TabsPanel() {
    const { isLoggedIn, user, isTrustee, isAdmin } = useAuth();

    const [tabValue, setTabValue] = useState(1);

    const onTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ flexGrow: 1, display: "flex" }}>
            <Tabs
                orientation="vertical"
                value={tabValue}
                onChange={onTabChange}
                sx={{ borderRight: 1, borderColor: "divider" }}>
                <Typography variant="h6" sx={{ marginBottom: 3 }}>
                    Váš účet
                </Typography>

                <Tab label="Informace" />
                <Tab label="Změnit heslo" />
                {isAdmin() && <Tab label="ejdmin" />}
            </Tabs>

            <TabPanel value={tabValue} index={1}>
                <BasicInfo />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                <ChangePassword />
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
                <AdminPanel />
            </TabPanel>
        </Box>
    );
}

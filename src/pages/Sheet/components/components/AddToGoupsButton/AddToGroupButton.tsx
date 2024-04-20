import { Diversity3, Tune } from "@mui/icons-material";
import {
    Divider,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem
} from "@mui/material";
import React, { useMemo, useRef, useState } from "react";
import { usePermissions } from "../../../../../hooks/auth/usePermissions";

export default function AddToGroupButton() {
    const permissions = usePermissions();
    const permissionsToAdd = useMemo(() => {
        if (permissions) {
            return permissions.permissions.filter(
                (p) => p.type === "GROUP_ADD_SONG"
            );
        }
        return [];
    }, [permissions]);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const onClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    return permissionsToAdd.length == 0 ? null : (
        <>
            <Divider />
            <MenuItem onClick={onClick}>
                <ListItemIcon>
                    <Diversity3 />
                </ListItemIcon>
                <ListItemText
                    primary="Skupiny"
                    secondary={"Přidat do skupiny"}
                />
            </MenuItem>
            <Menu
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}>
                <MenuItem>
                    <ListItemText primary={"Ahooj"} />
                </MenuItem>
            </Menu>
        </>
    );
}

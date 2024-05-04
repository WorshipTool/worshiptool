import { ListItemText, Menu, MenuItem } from "@mui/material";
import useAuth from "../../../../hooks/auth/useAuth";
import { useSmartNavigate } from "../../../../routes";

interface AccountMenuProps {
    anchor: Element | null;
    open: boolean;
    onClose: () => void;
}

export default function AccountMenu({
    anchor,
    open,
    onClose
}: AccountMenuProps) {
    const { logout, user } = useAuth();
    const navigate = useSmartNavigate();

    const onLogoutClick = () => {
        logout();
        onClose();
    };

    const onSettingClick = () => {
        navigate("account", {});
    };

    return (
        <Menu
            disableScrollLock
            anchorEl={anchor}
            open={open}
            onClose={onClose}
            MenuListProps={{
                "aria-labelledby": "basic-button"
            }}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right"
            }}>
            <MenuItem onClick={onSettingClick}>
                <ListItemText
                    primary={user?.firstName + " " + user?.lastName}
                    secondary={"Spravovat"}
                />
            </MenuItem>
            <MenuItem onClick={onLogoutClick}>Odhlásit se</MenuItem>
        </Menu>
    );
}

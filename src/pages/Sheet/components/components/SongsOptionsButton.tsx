import {
    Create,
    Dashboard,
    Settings,
    SettingsOutlined,
    SettingsRounded,
    SettingsTwoTone,
    Tune
} from "@mui/icons-material";
import {
    Box,
    CircularProgress,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Tooltip,
    useTheme
} from "@mui/material";
import React, { useMemo } from "react";
import DeleteButton from "./DeleteButton";
import { SongDto, SongVariantDto } from "../../../../api/dtos";
import CreateCopyButton from "./CreateCopyButton";
import useAuth from "../../../../hooks/auth/useAuth";
import SheetAdminButtons from "./SheetAdminButtons";
import { Sheet } from "@pepavlin/sheet-api";
import AddToPlaylistButton from "./AddToPlaylistButton/AddToPlaylistButton";
import EditButton from "./EditButton";
import VerifyButton from "./VerifyButton";
import { usePermissions } from "../../../../hooks/auth/usePermissions";
import AddToGroupButton from "./AddToGoupsButton/AddToGroupButton";

type SongsOptionsButtonProps = {
    reloadSong: () => void;
    variant: SongVariantDto;
    sheet: Sheet;
    song: SongDto;
    isInEditMode?: boolean;
    onEditClick: (editable: boolean) => Promise<void>;
    saving: boolean;
    editedTitle: string;
    isOwner: boolean;
    anyChange: boolean;
};

export default function SongsOptionsButton(props: SongsOptionsButtonProps) {
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setOpen(true);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(false);
        setAnchorEl(null);
    };

    const { isAdmin, isLoggedIn, isTrustee } = useAuth();
    const theme = useTheme();

    return (
        <>
            {isLoggedIn() && (
                <Tooltip title={"Další možnosti"}>
                    <IconButton onClick={handleClick}>
                        <Settings />
                    </IconButton>
                </Tooltip>
            )}
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}>
                {isLoggedIn() && (
                    <>
                        {props.isOwner && !props.variant.public && (
                            <Box
                                sx={{
                                    [theme.breakpoints.up("md")]: {
                                        display: "none"
                                    }
                                }}>
                                <EditButton
                                    inEditMode={props.isInEditMode}
                                    sheetData={props.variant.sheetData}
                                    title={props.variant.preferredTitle}
                                    loading={props.saving}
                                    asMenuItem
                                    onClick={props.onEditClick}
                                    anyChange={props.anyChange}
                                />
                            </Box>
                        )}
                        {props.isOwner ? (
                            <CreateCopyButton
                                variantGuid={props.variant.guid}
                                asMenuItem
                            />
                        ) : (
                            <Box
                                sx={{
                                    [theme.breakpoints.up("md")]: {
                                        display: "none"
                                    }
                                }}>
                                <CreateCopyButton
                                    variantGuid={props.variant.guid}
                                    asMenuItem
                                />
                            </Box>
                        )}

                        <Box
                            sx={{
                                [theme.breakpoints.up("sm")]: {
                                    display: "none"
                                }
                            }}>
                            <AddToPlaylistButton
                                variant={props.variant}
                                asMenuItem
                            />
                        </Box>

                        <MenuItem disabled>
                            <ListItemIcon>
                                <Dashboard />
                            </ListItemIcon>
                            <ListItemText
                                primary={"Karty"}
                                secondary={"Zobrazit jako karty"}
                            />
                        </MenuItem>

                        {isTrustee() && (
                            <>
                                <Divider />
                                <VerifyButton
                                    variant={props.variant}
                                    reloadSong={props.reloadSong}
                                />
                            </>
                        )}
                    </>
                )}

                <AddToGroupButton />

                {isAdmin() && (
                    <>
                        <Divider />
                        <SheetAdminButtons
                            sheet={props.sheet}
                            song={props.song}
                            reload={props.reloadSong}
                            variant={props.variant}
                            onEditClick={props.onEditClick}
                            isInEditMode={props.isInEditMode}
                            editLoading={props.saving}
                            editedTitle={props.editedTitle}
                            anyChange={props.anyChange}
                        />
                    </>
                )}
                {props.isOwner && (
                    <>
                        <Divider />
                        <DeleteButton
                            reloadSong={props.reloadSong}
                            variant={props.variant}
                            asMenuItem
                        />
                    </>
                )}
            </Menu>
        </>
    );
}

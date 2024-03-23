import {
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
import React from "react";
import DeleteButton from "./DeleteButton";
import { SongDto, SongVariantDto } from "../../../../api/dtos";
import CreateCopyButton from "./CreateCopyButton";
import useAuth from "../../../../hooks/auth/useAuth";
import SheetAdminButtons from "./SheetAdminButtons";
import { Sheet } from "@pepavlin/sheet-api";
import AddToPlaylistButton from "./AddToPlaylistButton/AddToPlaylistButton";
import EditButton from "./EditButton";

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

    const { isAdmin, isLoggedIn } = useAuth();
    const theme = useTheme();

    return (
        <>
            <Tooltip title={"Další možnosti"}>
                <IconButton onClick={handleClick}>
                    <Settings />
                </IconButton>
            </Tooltip>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}>
                {isLoggedIn() && (
                    <>
                        {props.isOwner && (
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
                                />
                            </Box>
                        )}
                        {props.isOwner && (
                            <CreateCopyButton
                                variantGuid={props.variant.guid}
                                asMenuItem
                            />
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
                    </>
                )}

                {isAdmin() && (
                    <SheetAdminButtons
                        sheet={props.sheet}
                        song={props.song}
                        reload={props.reloadSong}
                        variant={props.variant}
                        onEditClick={props.onEditClick}
                        isInEditMode={props.isInEditMode}
                        editLoading={props.saving}
                        editedTitle={props.editedTitle}
                    />
                )}
                {props.isOwner && <Divider />}
                {props.isOwner && (
                    <DeleteButton
                        reloadSong={props.reloadSong}
                        variant={props.variant}
                        asMenuItem
                    />
                )}
            </Menu>
        </>
    );
}

import { Dashboard, Settings } from "@mui/icons-material";
import {
    Box,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Tooltip,
    useTheme
} from "@mui/material";
import { Sheet } from "@pepavlin/sheet-api";
import React from "react";
import { SongDto, SongVariantDto } from "../../../../api/dtos";
import useAuth from "../../../../hooks/auth/useAuth";
import AddToGroupButton from "./AddToGoupsButton/AddToGroupButton";
import AddToPlaylistButton from "./AddToPlaylistButton/AddToPlaylistButton";
import CreateCopyButton from "./CreateCopyButton";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import SheetAdminButtons from "./SheetAdminButtons";
import VerifyButton from "./VerifyButton";

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

                <AddToGroupButton variantAlias={props.variant.alias} />

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

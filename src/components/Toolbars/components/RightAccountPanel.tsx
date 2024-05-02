import { AddBox, Apps, HelpOutline, Login, Search } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
    Avatar,
    Box,
    IconButton,
    SxProps,
    Theme,
    Tooltip,
    styled
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { isMobile, isTablet } from "react-device-detect";
import useAuth from "../../../hooks/auth/useAuth";
import useGroup from "../../../hooks/group/useGroup";
import UploadFileInput from "../../../pages/add_new_song/AddMenu/Upload/components/UploadFileInput";
import { useSmartNavigate } from "../../../routes/useSmartNavigate.1";
import AccountMenu from "./AccountMenu";
import GroupChip from "./GroupChip";
import ToolsMenu from "./Toolsmenu/ToolsMenu";

const Container = styled(Box)(({ theme }) => ({
    flex: 1,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    gap: 0,
    paddingRight: theme.spacing(2)
}));

function ProfileImage({ size, sx }: { size: number; sx?: SxProps<Theme> }) {
    return (
        <Box sx={{ ...sx }}>
            <Avatar
                src="/static/assets/profile-image-default.png"
                sx={{
                    width: size,
                    height: size,
                    borderColor: "inherit",
                    borderStyle: "solid",
                    borderWidth: 1.1,
                    pointerEvents: "none"
                }}
            />
        </Box>
    );
}

interface RightAccountPanelProps {
    transparent?: boolean;
}

export default function RightAccountPanel({
    transparent
}: RightAccountPanelProps) {
    const { isLoggedIn, loading } = useAuth();

    const color = useMemo(() => {
        return transparent ? "black" : "white";
    }, [transparent]);

    const shadowColor = useMemo(() => {
        return transparent ? "#ffffff44" : "#00000044";
    }, [transparent]);

    const iconStyle: SxProps<Theme> = {
        filter: `drop-shadow(4px 4px 2px ${shadowColor})`,
        transition: "all 0.2s ease",
        "&:hover": {
            // filter: "drop-shadow(0px 4px 4px #00000044)",
            filter: `drop-shadow(4px 4px 4px ${shadowColor})`,
            transform: "scale(110%)"
        },
        "&:active": {
            transform: "scale(98%)"
        },
        userSelect: "none"
    };

    const iconButtonStyle: SxProps = {
        marginLeft: -0.25,
        pointerEvents: "auto"
    };

    const fontSize = "medium";

    const openDocumentation = () => {
        navigate("documentation", {});
    };

    const onToolsMenuClick = () => {
        setToolsOpen((o) => !o);
    };

    const onAccountClick = (event: React.MouseEvent<HTMLElement>) => {
        setAccountMenuAnchor(event.currentTarget);
        setAccountMenuOpen(true);
    };

    const uploadInputRef = React.useRef<HTMLInputElement>(null);

    const onCreateSongClick = async () => {
        if (isMobile && !isTablet) {
            uploadInputRef.current?.click();
        } else {
            navigate("addMenu", {});
        }
    };

    const onLoginClick = () => {
        navigate("login", {
            state: {
                previousPage: window.location.pathname
            }
        });
    };

    const navigate = useSmartNavigate();
    const { isOn, code } = useGroup();
    const goHomeClick = () => {
        if (isOn) navigate("group", { params: { groupCode: code } });
        else navigate("home", {});

        setTimeout(() => {
            window.scroll({
                top: 100,
                behavior: "auto"
            });
            window.dispatchEvent(new Event("searchBarFocus"));
        }, 10);
    };

    const [toolsOpen, setToolsOpen] = useState(false);

    const [accountMenuAnchor, setAccountMenuAnchor] =
        useState<null | HTMLElement>(null);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);

    const isHome = window.location.pathname === "/";

    return (
        <>
            <Container color={color}>
                <UploadFileInput
                    onUpload={(files) => {
                        navigate("uploadParse", {
                            state: { files: files }
                        });
                    }}
                    inputRef={uploadInputRef}
                />

                {isHome ? (
                    <>
                        <Tooltip title={"O aplikaci"}>
                            <IconButton
                                color="inherit"
                                sx={iconButtonStyle}
                                onClick={openDocumentation}>
                                <HelpOutline
                                    sx={iconStyle}
                                    fontSize={fontSize}
                                />
                            </IconButton>
                        </Tooltip>
                    </>
                ) : (
                    <>
                        <Tooltip title={"Hledat"}>
                            <IconButton
                                color="inherit"
                                sx={iconButtonStyle}
                                onClick={goHomeClick}>
                                <Search sx={iconStyle} fontSize={fontSize} />
                            </IconButton>
                        </Tooltip>
                    </>
                )}

                {isLoggedIn() ? (
                    <>
                        <Tooltip title={"Přidat novou píseň"}>
                            <IconButton
                                color="inherit"
                                sx={iconButtonStyle}
                                onClick={onCreateSongClick}
                                disabled={false}>
                                <AddBox sx={iconStyle} fontSize={fontSize} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={"Nástroje"}>
                            <IconButton
                                color="inherit"
                                sx={iconButtonStyle}
                                onClick={onToolsMenuClick}>
                                <Apps sx={iconStyle} fontSize={fontSize} />
                            </IconButton>
                        </Tooltip>

                        {isOn ? (
                            <GroupChip
                                avatar={
                                    <Tooltip title={"Účet"}>
                                        <IconButton
                                            color="inherit"
                                            sx={iconButtonStyle}
                                            onClick={onAccountClick}>
                                            <ProfileImage
                                                size={26}
                                                sx={iconStyle}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                }
                            />
                        ) : (
                            <Tooltip title={"Účet"}>
                                <IconButton
                                    color="inherit"
                                    sx={iconButtonStyle}
                                    onClick={onAccountClick}>
                                    <ProfileImage size={26} sx={iconStyle} />
                                </IconButton>
                            </Tooltip>
                        )}

                        <AccountMenu
                            open={accountMenuOpen}
                            onClose={() => setAccountMenuOpen(false)}
                            anchor={accountMenuAnchor}
                        />

                        <ToolsMenu
                            open={toolsOpen}
                            onClose={() => setToolsOpen(false)}
                        />
                    </>
                ) : (
                    <>
                        <Tooltip title={"Příhlásit se"}>
                            <LoadingButton
                                variant="text"
                                color="inherit"
                                endIcon={
                                    <Login sx={iconStyle} fontSize={fontSize} />
                                }
                                sx={{
                                    transition: "all 0.2s ease",
                                    ":hover": {
                                        transform: "scale(102%)"
                                    },
                                    pointerEvents: "auto"
                                }}
                                onClick={onLoginClick}
                                loading={loading}
                                loadingPosition="end">
                                Přihlásit se
                            </LoadingButton>
                        </Tooltip>
                    </>
                )}
            </Container>
        </>
    );
}

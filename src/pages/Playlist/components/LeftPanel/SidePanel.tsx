import { Dashboard, Edit, Print } from "@mui/icons-material";
import { Masonry } from "@mui/lab";
import {
    Box,
    Button,
    ButtonGroup,
    Chip,
    CircularProgress,
    IconButton,
    InputBase,
    Typography,
    styled,
    useTheme
} from "@mui/material";
import React, { useEffect, useState } from "react";
import OnChangeDelayer from "../../../../common/providers/ChangeDelayer/ChangeDelayer";
import Gap from "../../../../common/ui/Gap/Gap";
import useGroup from "../../../../hooks/group/useGroup";
import useCurrentPlaylist from "../../../../hooks/playlist/useCurrentPlaylist";
import useInnerPlaylist from "../../hooks/useInnerPlaylist";
import PanelItem from "./PanelItem";
import { useSmartNavigate } from "../../../../routes";

const Container = styled(Box)(({ theme }) => ({
    width: 300,
    backgroundColor: theme.palette.grey[100],
    boxShadow: `0px 0px 3px ${theme.palette.grey[400]}`,
    height: "calc(100vh - 56px)",
    position: "sticky",
    top: 56
}));

export default function SidePanel({}: {}) {
    const { isOn, guid: currentPlaylistGuid } = useCurrentPlaylist();
    const {
        rename,
        playlist,
        items,
        guid: playlistGuid,
        loading,
        isOwner
    } = useInnerPlaylist();

    const { isOn: isGroupOn } = useGroup();

    const [title, setTitle] = useState<string>("");

    const [saving, setSaving] = useState(0);

    const [someIsMoving, setSomeIsMoving] = useState(false);

    const navigate = useSmartNavigate();

    useEffect(() => {
        setTitle(playlist?.title || "");
        console.log(isOwner, playlist);
    }, [playlist]);

    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
    };

    useEffect(() => {
        if (title === "") setTitle(playlist?.title || "");
    }, [playlist?.title]);

    const onPrint = () => {
        window.print();
    };

    const onPanelItemClickCall = (guid: string) => {
        const el = document.getElementById("playlistItem_" + guid);
        el?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };

    const openCards = () => {
        navigate("playlistCards", {
            params: {
                guid: playlistGuid
            }
        });
    };

    const inputRef = React.useRef<HTMLInputElement>(null);

    const focusTitle = () => {
        inputRef.current?.focus();
    };

    const theme = useTheme();

    const doRename = async () => {
        setSaving((s) => s + 1);
        await rename(title);
        setSaving((s) => s - 1);
    };

    return (
        <Container displayPrint={"none"}>
            {loading ? (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "start",
                        justifyContent: "center",
                        height: "100%",
                        paddingTop: 5
                    }}>
                    <Typography>Načítám playlist...</Typography>
                    <Gap value={1} horizontal />
                    <CircularProgress size={"2rem"} />
                </Box>
            ) : (
                <>
                    <OnChangeDelayer
                        value={title}
                        onChange={() => {
                            if (!isOwner) return;
                            if (title !== playlist?.title && title !== "") {
                                doRename();
                            }
                        }}
                        delay={800}
                    />
                    <Box
                        margin={2}
                        maxHeight={`calc(100vh - ${theme.spacing(4)} - 56px)`}
                        display={"flex"}
                        flexDirection={"column"}>
                        <Box
                            display={"flex"}
                            flexDirection={"row"}
                            alignItems={"center"}>
                            {isOwner ? (
                                <Box
                                    display={"flex"}
                                    flexDirection={"row"}
                                    alignItems={"center"}
                                    sx={{
                                        borderRadius: 2,
                                        marginRight: 1
                                    }}>
                                    <InputBase
                                        value={title}
                                        onChange={onTitleChange}
                                        sx={{
                                            fontWeight: "bold",
                                            fontSize: "1.4rem",
                                            "&.Mui-focused": {
                                                backgroundColor: "white",
                                                paddingLeft: 1,
                                                borderRadius: 2
                                            }
                                        }}
                                        placeholder="Název playlistu"
                                        inputRef={inputRef}
                                    />
                                    <Gap horizontal />
                                    {saving > 0 ? (
                                        <>
                                            <Typography variant="subtitle2">
                                                Ukládání...
                                            </Typography>
                                        </>
                                    ) : (
                                        <>
                                            <IconButton onClick={focusTitle}>
                                                <Edit />
                                            </IconButton>
                                        </>
                                    )}
                                </Box>
                            ) : (
                                <Box
                                    display={"flex"}
                                    flexDirection={"row"}
                                    alignItems={"center"}>
                                    <Typography
                                        sx={{
                                            fontWeight: "bold",
                                            fontSize: "1.4rem"
                                        }}>
                                        {title}
                                    </Typography>
                                </Box>
                            )}
                            {isOn && currentPlaylistGuid === playlist?.guid ? (
                                <Chip
                                    label={"Aktivní"}
                                    size="small"
                                    color="secondary"
                                />
                            ) : (
                                <></>
                            )}
                        </Box>
                        <Gap value={2} />
                        <Box display={"flex"} flexDirection={"row"}>
                            <Typography
                                variant="h6"
                                fontWeight={"bold"}
                                flex={1}>
                                Pořadí
                            </Typography>
                        </Box>
                        <Gap />
                        {items.length == 0 && (
                            <>
                                <Typography variant="subtitle2">
                                    V playlistu nejsou žádné písně...
                                </Typography>
                            </>
                        )}
                        <Box
                            flex={1}
                            display={"flex"}
                            flexDirection={"column"}
                            alignItems={"center"}
                            bgcolor={theme.palette.grey[100]}
                            sx={{
                                "&::-webkit-scrollbar": {
                                    display: "auto"
                                },
                                paddingTop: 1,
                                paddingBottom: 8,
                                overflowY: "auto"
                            }}>
                            <Masonry columns={1}>
                                {items.map((item) => {
                                    return (
                                        <PanelItem
                                            setMoving={setSomeIsMoving}
                                            moving={someIsMoving}
                                            item={item}
                                            key={"order_" + item.guid}
                                            onClick={() =>
                                                onPanelItemClickCall(item.guid)
                                            }
                                        />
                                    );
                                })}
                            </Masonry>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 30,
                            right: 30,
                            left: 30,
                            displayPrint: "none",
                            pointerEvents: "none"
                        }}
                        display={"flex"}
                        alignItems={"end"}
                        gap={1}
                        justifyContent={"space-between"}
                        flexDirection={"row"}>
                        <ButtonGroup
                            sx={{
                                flex: 1
                            }}>
                            {items.length > 0 && (
                                <Button
                                    variant="outlined"
                                    // startIcon={<Dashboard />}
                                    onClick={openCards}
                                    color={isGroupOn ? "primary" : "primary"}
                                    sx={{ pointerEvents: "auto" }}>
                                    Prezentace
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                onClick={onPrint}
                                startIcon={<Print />}
                                sx={{ pointerEvents: "auto", flex: 1 }}>
                                Tisk
                            </Button>
                        </ButtonGroup>
                    </Box>
                </>
            )}
        </Container>
    );
}

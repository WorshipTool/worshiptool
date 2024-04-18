import { Dashboard, Edit } from "@mui/icons-material";
import { Masonry } from "@mui/lab";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    IconButton,
    InputBase,
    Typography,
    styled,
    useTheme
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import OnChangeDelayer from "../../../../components/ChangeDelayer";
import Gap from "../../../../components/Gap";
import useAuth from "../../../../hooks/auth/useAuth";
import useGroup from "../../../../hooks/group/useGroup";
import useCurrentPlaylist from "../../../../hooks/playlist/useCurrentPlaylist";
import { getPlaylistCardsUrl } from "../../../../routes/routes";
import useInnerPlaylist from "../../hooks/useInnerPlaylist";
import DraggableList from "../../../../components/DraggableList/DraggableList";
import PanelItem from "./PanelItem";
import { PlaylistItemDTO } from "../../../../interfaces/playlist/PlaylistDTO";
import { AnimatePresence, Reorder } from "framer-motion";

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
        items: _i,
        guid: playlistGuid,
        loading,
        isOwner,
        reorder
    } = useInnerPlaylist();

    const { isOn: isGroupOn } = useGroup();

    const [title, setTitle] = useState<string>("");

    const [saving, setSaving] = useState(0);

    const [someIsMoving, setSomeIsMoving] = useState(false);

    const navigate = useNavigate();

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
        navigate(getPlaylistCardsUrl(playlistGuid));
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

    const [itemsOrder, setItemsOrder] = useState<PlaylistItemDTO[]>([]);
    useEffect(() => {
        if (_i.length != itemsOrder.length) setItemsOrder(_i);
    }, [_i]);
    const handleReorder = (newOrder: PlaylistItemDTO[]) => {
        setItemsOrder(newOrder);
    };

    const onReorderEnd = () => {
        if (itemsOrder.length === 0) return;
        const newOrder = itemsOrder.map((item, index) => {
            return { guid: item.guid, order: index };
        });
        reorder(newOrder);
    };

    const onMove = async (direction: number, from: number) => {
        if (from + direction < 0 || from + direction >= itemsOrder.length)
            return;
        const newOrder = [...itemsOrder];
        const temp = newOrder[from];
        newOrder[from] = newOrder[from + direction];
        newOrder[from + direction] = temp;
        setItemsOrder(newOrder);
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
                        {itemsOrder.length == 0 && (
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
                            {/* <Masonry columns={1}>
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
                            </Masonry> */}
                            {/* <Masonry> */}
                            <div
                                style={{
                                    // width: "100%",
                                    // height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    backgroundColor: theme.palette.grey[200]
                                }}>
                                <Reorder.Group
                                    values={itemsOrder}
                                    onReorder={handleReorder}
                                    onMouseUp={onReorderEnd}
                                    axis="y"
                                    as="div"
                                    style={{
                                        gap: 8,
                                        display: "flex",
                                        flexDirection: "column",
                                        padding: 4,
                                        position: "relative"
                                    }}>
                                    {itemsOrder.map((item, index) => {
                                        return (
                                            <Reorder.Item
                                                value={item}
                                                key={item.guid}
                                                whileDrag={{
                                                    scale: 1.05,
                                                    zIndex: 1000
                                                }}
                                                whileHover={{
                                                    scale: 1.01,
                                                    zIndex: 1000,
                                                    position: "sticky",
                                                    top: 0
                                                }}
                                                style={{}}
                                                as="div">
                                                <PanelItem
                                                    setMoving={setSomeIsMoving}
                                                    moving={someIsMoving}
                                                    item={item}
                                                    index={index}
                                                    onMove={(direction) =>
                                                        onMove(direction, index)
                                                    }
                                                    key={"order_" + item.guid}
                                                    onClick={() =>
                                                        onPanelItemClickCall(
                                                            item.guid
                                                        )
                                                    }
                                                    itemsCount={
                                                        itemsOrder.length
                                                    }
                                                />
                                            </Reorder.Item>
                                        );
                                    })}
                                </Reorder.Group>
                            </div>
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
                        justifyContent={"space-between"}>
                        {itemsOrder.length > 0 ? (
                            <Box sx={{ pointerEvents: "auto" }}>
                                <Button
                                    variant="contained"
                                    startIcon={<Dashboard />}
                                    onClick={openCards}
                                    color={isGroupOn ? "secondary" : "primary"}>
                                    Karty
                                </Button>
                            </Box>
                        ) : (
                            <Box />
                        )}
                        <Button
                            variant="contained"
                            onClick={onPrint}
                            sx={{ pointerEvents: "auto" }}>
                            Vytisknout
                        </Button>
                    </Box>
                </>
            )}
        </Container>
    );
}

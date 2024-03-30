import {
    Box,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListSubheader,
    Typography
} from "@mui/material";
import React from "react";
import useGroup from "../../../../hooks/group/useGroup";
import Gap from "../../../../components/Gap";
import CreatePlaylistButton from "../CreatePlaylistButton";
import useGroupSelection from "../../../../hooks/group/useGroupSelection";
import useCurrentPlaylist from "../../../../hooks/playlist/useCurrentPlaylist";
import { useNavigate } from "react-router-dom";
import { getPlaylistUrl } from "../../../../routes/routes";

export default function LeftGroupPanel() {
    const { name } = useGroup();
    const { count } = useGroupSelection();
    const { isOn, turnOff, guid } = useCurrentPlaylist();
    const navigate = useNavigate();

    const openActivePlaylist = () => {
        navigate(getPlaylistUrl(guid));
    };

    return (
        <>
            <Box
                bgcolor={"#414141"}
                minWidth={300}
                top={0}
                zIndex={10}
                bottom={0}
                display={"flex"}
                flexDirection={"column"}>
                <Box padding={3} color={"white"}>
                    <Typography variant="h5" fontWeight={900}>
                        Církev bratrská na Praze 13
                    </Typography>
                    <Gap value={2} />
                    <Typography variant="subtitle2">
                        Má v okruhu celkem {count} písní
                    </Typography>
                </Box>
                <Box
                    padding={1}
                    flex={1}
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"end"}>
                    {isOn ? (
                        <>
                            <Button
                                color="secondary"
                                variant="contained"
                                onClick={openActivePlaylist}>
                                Otevřít aktivní playlist
                            </Button>
                            <Gap />
                        </>
                    ) : (
                        <></>
                    )}
                    <CreatePlaylistButton />
                </Box>
            </Box>
        </>
    );
}

import {
    Box,
    Button,
    Card,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    TextField,
    Typography,
    styled
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePlaylists from "../../hooks/playlist/usePlaylists";
import { Add, Remove } from "@mui/icons-material";
import useCurrentPlaylist from "../../hooks/playlist/useCurrentPlaylist";
import AppLayout from "../../components/app/AppLayout/AppLayout";
import Gap from "../../components/Gap";
import { LoadingButton } from "@mui/lab";
import { useApiStateEffect } from "../../tech/ApiState";
import { getPlaylistUrl } from "../../routes/routes";
import { useWindowTitle } from "../../hooks/useWindowTitle";

const StyledContainer = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.grey[100],

    padding: "0.5rem",
    "&:hover": {
        backgroundColor: theme.palette.grey[200]
    },
    cursor: "pointer"
}));

export default function () {
    const {
        getPlaylistsOfUser,
        createPlaylist: createWithName,
        deletePlaylist: deleteByGuid
    } = usePlaylists();
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();

    useWindowTitle("Playlisty");

    const [createLoading, setCreateLoading] = useState(false);

    const [{ data: playlists, loading, error }, reload] =
        useApiStateEffect(() => {
            return getPlaylistsOfUser().then((r) => {
                return r.playlists;
            });
        }, []);

    useEffect(() => {
        if (loaded) return;
        if (!loading) setLoaded(true);
    }, [loading]);

    const { guid: playlistGuid, turnOn, turnOff } = useCurrentPlaylist();

    const onCreateClick = () => {
        setCreateLoading(true);
        createPlaylist();
    };

    const createPlaylist = async () => {
        try {
            const result = await createWithName(
                "Nový playlist " + playlists?.length
            );
            navigate(getPlaylistUrl(result.guid));
            turnOn(result.guid);
        } catch (e: any) {
            console.log("Something went wrong:", e.message);
            setCreateLoading(false);
        }
    };

    const deletePlaylist = async (guid: string) => {
        if (playlistGuid === guid) turnOff();
        deleteByGuid(guid)
            .then((result) => {
                reload();
            })
            .catch((e: any) => {
                console.log("Something went wrong:", e.message);
            });
    };

    const openPlaylist = (guid: string) => {
        navigate(getPlaylistUrl(guid));
    };
    const { isOn, guid: currentPlaylistGuid } = useCurrentPlaylist();

    const ListPlaylistItem = ({
        name,
        guid
    }: {
        name: string;
        guid: string;
    }) => {
        return (
            <StyledContainer
                sx={{
                    padding: 0,
                    marginBottom: 1,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center"
                }}>
                <Button
                    onClick={() => openPlaylist(guid)}
                    fullWidth
                    color="warning">
                    {name}
                </Button>
                <IconButton>
                    <Remove onClick={() => deletePlaylist(guid)} />
                </IconButton>
                <Box position={"absolute"} marginLeft={1}>
                    {isOn && currentPlaylistGuid == guid ? (
                        <Chip
                            label={"Aktivní"}
                            size="small"
                            color="secondary"
                        />
                    ) : (
                        <></>
                    )}
                </Box>
            </StyledContainer>
        );
    };

    return (
        <>
            <AppLayout>
                <Box display={"flex"} justifyContent={"center"}>
                    <Box sx={{ maxWidth: 500, marginTop: 7 }} flex={1}>
                        {error ? (
                            <>
                                <Typography>
                                    Při načítání nastala chyba.
                                </Typography>
                                <Typography>{error.message}</Typography>
                            </>
                        ) : (
                            <></>
                        )}
                        <Box display={"flex"} marginBottom={3}>
                            <Typography variant="h5" fontWeight={600} flex={1}>
                                Moje playlisty:
                            </Typography>

                            <LoadingButton
                                loading={createLoading}
                                loadingPosition="start"
                                startIcon={<Add />}
                                variant="contained"
                                onClick={onCreateClick}>
                                Vytvořit
                            </LoadingButton>
                        </Box>
                        {!loaded ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flex: 1,
                                    color: "black"
                                }}>
                                <Typography>Načítání playlistů...</Typography>
                                <Gap horizontal />
                                <CircularProgress
                                    size={"2rem"}
                                    color="inherit"
                                />
                            </Box>
                        ) : (
                            <>
                                {playlists?.map((p) => {
                                    return (
                                        <ListPlaylistItem
                                            name={p.title}
                                            guid={p.guid}
                                            key={p.guid}
                                        />
                                    );
                                })}

                                {playlists?.length == 0 && (
                                    <>
                                        <Typography>
                                            Nemáš žádný vytvořený playlist.
                                        </Typography>
                                    </>
                                )}
                            </>
                        )}
                    </Box>
                </Box>
            </AppLayout>
        </>
    );
}

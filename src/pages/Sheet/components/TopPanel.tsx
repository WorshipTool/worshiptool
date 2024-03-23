import React, { useMemo } from "react";
import TransposePanel from "./TransposePanel";
import { Box, Button, useTheme } from "@mui/material";
import useAuth from "../../../hooks/auth/useAuth";
import VerifyButton from "./components/VerifyButton";
import { VariantDTO } from "../../../interfaces/variant/VariantDTO";
import SheetAdminButtons from "./components/SheetAdminButtons";
import { Sheet } from "@pepavlin/sheet-api";
import Song from "../../../interfaces/song/song";
import AddToPlaylistButton from "./components/AddToPlaylistButton/AddToPlaylistButton";
import PrintButton from "./components/PrintButton";
import Buttons13ka from "./components/Buttons13ka";
import ChangeVariant from "./components/ChangeVariant";
import EditButton from "./components/EditButton";
import { PostEditVariantBody } from "../../../api/dtos/dtosSong";
import { useSnackbar } from "notistack";
import DeleteButton from "./components/DeleteButton";
import Gap from "../../../components/Gap";
import {
    EditVariantOutDto,
    SongEditingApi,
    SongsApi
} from "../../../api/generated";
import { useApiState } from "../../../tech/ApiState";
import { handleApiCall } from "../../../tech/handleApiCall";
import CreateCopyButton from "./components/CreateCopyButton";
import { SongDto, SongVariantDto } from "../../../api/dtos";
import { useNavigate } from "react-router-dom";
import { getVariantUrl } from "../../../routes/routes";
import SongsOptionsButton from "./components/SongsOptionsButton";

interface TopPanelProps {
    transpose: (i: number) => void;
    variant: SongVariantDto;
    reloadSong: () => void;
    sheet: Sheet;
    title: string;
    editedTitle: string;
    song: SongDto;
    // variantIndex: number
    // onChangeVariant: (i:number)=>void,
    onEditClick?: (editable: boolean) => Promise<void>;
    cancelEditing: () => void;
    isInEditMode?: boolean;
}

export default function TopPanel(props: TopPanelProps) {
    const { isAdmin, isTrustee, isLoggedIn, user, apiConfiguration } =
        useAuth();

    const isOwner = useMemo(() => {
        if (!user) return false;
        return props.variant.createdBy === user?.guid;
    }, [user, props.variant]);

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const songsApi = new SongEditingApi(apiConfiguration);
    const { fetchApiState, apiState } = useApiState<EditVariantOutDto>();

    const [saving, setSaving] = React.useState(false);

    const onEditClick = async (editable: boolean) => {
        if (editable) {
            if (props.variant.verified) {
                enqueueSnackbar("Nelze upravit veřejenou píseň.");
                return;
            }
            await props.onEditClick?.(editable);
            return;
        }

        setSaving(true);

        const body: PostEditVariantBody = {
            guid: props.variant.guid,
            sheetData: props.sheet.getOriginalSheetData(),
            title: props.title
        };
        fetchApiState(
            async () => {
                return await handleApiCall(
                    songsApi.songEditingControllerEditVariant(body)
                );
            },
            async (result) => {
                await props.onEditClick?.(editable);
                enqueueSnackbar(
                    `Píseň ${
                        (props.variant.preferredTitle && " ") || ""
                    }byla upravena.`
                );
                navigate(getVariantUrl(result.alias));
                setSaving(false);
            }
        );
    };

    const theme = useTheme();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1
            }}>
            {props.isInEditMode ? (
                <>
                    <Box flex={1} />

                    <Button
                        onClick={() => props.cancelEditing()}
                        color="info"
                        variant="outlined">
                        Zrušit
                    </Button>

                    <EditButton
                        onClick={onEditClick}
                        inEditMode={props.isInEditMode}
                        loading={saving}
                        sheetData={props.sheet?.getOriginalSheetData() || ""}
                        title={props.editedTitle}
                    />
                </>
            ) : props.variant.deleted ? (
                <></>
            ) : (
                <>
                    <TransposePanel transpose={props.transpose} />

                    {(isAdmin() || isTrustee()) && !saving && (
                        <Box
                            sx={{
                                [theme.breakpoints.down("md")]: {
                                    display: "none"
                                }
                            }}>
                            <VerifyButton
                                variant={props.variant}
                                reloadSong={props.reloadSong}
                            />
                        </Box>
                    )}

                    <Box flex={1} />

                    <SongsOptionsButton
                        reloadSong={props.reloadSong}
                        variant={props.variant}
                        sheet={props.sheet}
                        song={props.song}
                        onEditClick={onEditClick}
                        isInEditMode={props.isInEditMode}
                        saving={saving}
                        editedTitle={props.editedTitle}
                        isOwner={isOwner}
                    />
                    {isLoggedIn() && !isOwner && (
                        <Box
                            sx={{
                                [theme.breakpoints.down("sm")]: {
                                    display: "none"
                                }
                            }}>
                            <CreateCopyButton
                                variantGuid={props.variant.guid}
                            />
                        </Box>
                    )}

                    {isOwner && (
                        <Box
                            sx={{
                                [theme.breakpoints.down("md")]: {
                                    display: "none"
                                }
                            }}>
                            <EditButton
                                onClick={onEditClick}
                                inEditMode={props.isInEditMode}
                                loading={saving}
                                sheetData={
                                    props.sheet?.getOriginalSheetData() || ""
                                }
                                title={props.editedTitle}
                            />
                        </Box>
                    )}

                    {isLoggedIn() && (
                        <Box
                            sx={{
                                [theme.breakpoints.down("sm")]: {
                                    display: "none"
                                }
                            }}>
                            <AddToPlaylistButton variant={props.variant} />
                        </Box>
                    )}

                    <PrintButton />
                </>
            )}
        </Box>
    );
}

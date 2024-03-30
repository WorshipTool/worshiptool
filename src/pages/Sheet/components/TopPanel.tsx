import React, { useMemo } from "react";
import TransposePanel from "./TransposePanel";
import { Box, Button, Typography, useTheme } from "@mui/material";
import useAuth from "../../../hooks/auth/useAuth";
import VerifyButton from "./components/VerifyButton";
import { Sheet } from "@pepavlin/sheet-api";
import AddToPlaylistButton from "./components/AddToPlaylistButton/AddToPlaylistButton";
import PrintButton from "./components/PrintButton";
import EditButton from "./components/EditButton";
import { useSnackbar } from "notistack";
import {
    EditVariantOutDto,
    PostEditVariantInDto,
    SongEditingApi
} from "../../../api/generated";
import { useApiState } from "../../../tech/ApiState";
import { handleApiCall } from "../../../tech/handleApiCall";
import CreateCopyButton from "./components/CreateCopyButton";
import { SongDto, SongVariantDto } from "../../../api/dtos";
import { useNavigate } from "react-router-dom";
import { getVariantUrl } from "../../../routes/routes";
import SongsOptionsButton from "./components/SongsOptionsButton";
import NotValidWarning from "../../add_new_song/Write/components/NotValidWarning";
import { isSheetDataValid } from "../../../tech/sheet.tech";
import { Public, PublicOff } from "@mui/icons-material";
import VisibilityLabel from "./components/VisibilityLabel";

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
    const { fetchApiState } = useApiState<EditVariantOutDto>();

    const [saving, setSaving] = React.useState(false);

    const anyChange = useMemo(() => {
        const t = props.variant.preferredTitle !== props.editedTitle;
        const s =
            new Sheet(props.variant?.sheetData).toString() !==
            props.sheet?.toString();
        return t || s;
    }, [props.sheet, props.editedTitle, props.variant]);

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

        const body: PostEditVariantInDto = {
            variantAlias: props.variant.alias,
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

    const isValid = useMemo(() => {
        if (!props.sheet) return false;
        const data = props.sheet?.toString();
        return isSheetDataValid(data);
    }, [props.sheet, props.sheet?.toString()]);

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
                    {isValid ? <Box flex={1} /> : <NotValidWarning />}

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
                        anyChange={anyChange}
                    />
                </>
            ) : props.variant.deleted ? (
                <></>
            ) : (
                <>
                    <TransposePanel
                        transpose={props.transpose}
                        disabled={!Boolean(props.sheet?.getKeyChord())}
                    />

                    {isOwner && (
                        <VisibilityLabel public={props.variant.public} />
                    )}

                    <Box flex={1} />

                    {isOwner && (
                        <VisibilityLabel public={props.variant.public} right />
                    )}
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
                        anyChange={anyChange}
                    />
                    {isLoggedIn() && props.variant.public && (
                        <Box
                            sx={{
                                [theme.breakpoints.down("md")]: {
                                    display: "none"
                                }
                            }}>
                            <CreateCopyButton
                                variantGuid={props.variant.guid}
                            />
                        </Box>
                    )}

                    {isOwner && !props.variant.public && (
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
                                anyChange={anyChange}
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

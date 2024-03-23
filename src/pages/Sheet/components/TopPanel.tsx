import React, { useMemo } from "react";
import TransposePanel from "./TransposePanel";
import { Box, useTheme } from "@mui/material";
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

                    <EditButton
                        onClick={onEditClick}
                        inEditMode={props.isInEditMode}
                        loading={saving}
                        sheetData={props.sheet?.getOriginalSheetData() || ""}
                        title={props.editedTitle}
                    />
                </>
            ) : props.variant.deleted ? (
                <>
                    {/* {isAdmin() && props.song.variants.length > 1 && (
						<Box
							sx={{
								[theme.breakpoints.down("md")]: {
									display: "none"
								}
							}}>
							<ChangeVariant
								index={props.variantIndex}
								onChange={props.onChangeVariant}
								variants={props.song.variants}
							/>
						</Box>
					)} */}
                </>
            ) : (
                <>
                    <TransposePanel transpose={props.transpose} />

                    {/* {isAdmin() && props.song.variants.length > 1 && (
						<Box
							sx={{
								[theme.breakpoints.down("md")]: {
									display: "none"
								}
							}}>
							<ChangeVariant
								index={props.variantIndex}
								onChange={props.onChangeVariant}
								variants={props.song.variants}
							/>
						</Box>
					)} */}

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

                    <CreateCopyButton variantGuid={props.variant.guid} />

                    {isOwner && (
                        <Box
                            sx={{
                                [theme.breakpoints.down("md")]: {
                                    display: "none"
                                },
                                display: "flex",
                                flexDirection: "row",
                                gap: 1
                            }}>
                            <DeleteButton
                                reloadSong={props.reloadSong}
                                variant={props.variant}
                            />
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

                    {isAdmin() && (
                        <Box
                            sx={{
                                [theme.breakpoints.down("lg")]: {
                                    display: "none"
                                }
                            }}>
                            <SheetAdminButtons
                                sheet={props.sheet}
                                song={props.song}
                                reload={props.reloadSong}
                                variant={props.variant}
                                onEditClick={onEditClick}
                                isInEditMode={props.isInEditMode}
                                editLoading={saving}
                                editedTitle={props.editedTitle}
                            />
                        </Box>
                    )}

                    {isLoggedIn() && (
                        <Box
                            sx={{
                                [theme.breakpoints.down("md")]: {
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

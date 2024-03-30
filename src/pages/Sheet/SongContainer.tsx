import React, { useEffect, useState } from "react";
import { useSongVariant } from "../../hooks/song/useSongVariant";
import { SkeletonLoaderCore } from "../../components/SkeletonLoader";
import {
    Box,
    CircularProgress,
    LinearProgress,
    Typography,
    useTheme
} from "@mui/material";
import SheetDisplay from "../../components/SheetDisplay/SheetDisplay";
import { Sheet, transpose } from "@pepavlin/sheet-api";
import { Helmet } from "react-helmet";
import AppContainer from "../../components/AppContainer/AppContainer";
import ContainerGrid from "../../components/ContainerGrid";
import Gap from "../../components/Gap";
import { VariantDTO } from "../../interfaces/variant/VariantDTO";
import AdditionalSongInfoPanel from "./components/AdditionalSongInfoPanel";
import DeletedInfoPanel from "./components/components/DeletedInfoPanel";
import ToolbarHeaderSheetPage from "./components/ToolbarHeaderSheetPage";
import TopPanel from "./components/TopPanel";
import { SongDto, SongVariantDto } from "../../api/dtos";
import { useRerender } from "../../hooks/useRerender";
import { useBrowserTitle } from "../../hooks/useBrowserTitle";
import { SourcesList } from "./components/SourcesList/SourcesList";

export type SongPageProps = {
    variantGuid: string;
    stateTitle?: string;
};

export default function SongContainer({
    variantGuid,
    stateTitle
}: SongPageProps) {
    const { state, loading, title, variant, song, sheet } =
        useSongVariant(variantGuid);

    useBrowserTitle(title ? [title] : undefined);

    const theme = useTheme();

    const rerender = useRerender();

    // Current sheet
    const [currentSheet, setCurrentSheet] = useState<Sheet>();
    useEffect(() => {
        if (sheet) setCurrentSheet(sheet);
    }, [sheet]);

    // Current title
    const [editedTitle, setEditedTitle] = useState("");
    useEffect(() => {
        if (title) setEditedTitle(title);
    }, [title]);

    const transpose = (value: number) => {
        if (currentSheet) {
            currentSheet.transpose(value);
            rerender();
        }
    };

    const reload = () => {
        window.location.reload();
    };

    const [inEditMode, setInEditMode] = useState(false);

    const onEditClick = async (editable: boolean) => {
        setInEditMode(editable);
    };

    const cancelEditing = () => {
        setInEditMode(false);
        setCurrentSheet(sheet);
        if (title) setEditedTitle(title);
    };

    return (
        <>
            {state.loading && <LinearProgress />}
            <Box
                sx={{
                    display: "flex",
                    displayPrint: "none",
                    flexDirection: "column",
                    alignItems: "center"
                }}>
                <ContainerGrid
                    sx={{
                        marginTop: 2,
                        marginBottom: 2,
                        padding: 3,
                        backgroundColor: theme.palette.grey[100],
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderColor: theme.palette.grey[400],
                        borderRadius: 1,
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        [theme.breakpoints.down("sm")]: {
                            marginTop: 0
                        }
                    }}>
                    <SkeletonLoaderCore
                        data={[state]}
                        renderLoading={() =>
                            stateTitle ? (
                                <>
                                    <Typography>
                                        Načítání písně <b>{stateTitle}</b>...
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <Typography>Načítání...</Typography>
                                </>
                            )
                        }
                        renderError={() => (
                            <>
                                <Typography>Píseň nenalezena...</Typography>
                            </>
                        )}
                        render={() => (
                            <>
                                <Box>
                                    <TopPanel
                                        transpose={transpose}
                                        variant={variant as SongVariantDto}
                                        reloadSong={reload}
                                        title={editedTitle}
                                        editedTitle={editedTitle}
                                        sheet={currentSheet as Sheet}
                                        song={song as SongDto}
                                        onEditClick={onEditClick}
                                        isInEditMode={inEditMode}
                                        cancelEditing={cancelEditing}
                                    />
                                    <Gap value={2} />
                                    <>
                                        {variant && variant.deleted ? (
                                            <>
                                                <DeletedInfoPanel
                                                    variant={variant}
                                                    reloadSong={reload}
                                                />
                                            </>
                                        ) : (
                                            currentSheet && (
                                                <>
                                                    <SheetDisplay
                                                        sheet={currentSheet}
                                                        title={editedTitle}
                                                        variant={"default"}
                                                        editMode={inEditMode}
                                                        onChange={(
                                                            sheet,
                                                            title
                                                        ) => {
                                                            setCurrentSheet(
                                                                new Sheet(sheet)
                                                            );
                                                            setEditedTitle(
                                                                title
                                                            );
                                                        }}
                                                    />
                                                </>
                                            )
                                        )}
                                    </>
                                    {!inEditMode &&
                                        variant &&
                                        !variant.deleted && (
                                            <AdditionalSongInfoPanel
                                                song={song as SongDto}
                                                variant={
                                                    variant as SongVariantDto
                                                }
                                            />
                                        )}
                                </Box>
                            </>
                        )}
                    />
                </ContainerGrid>
            </Box>
            <Box displayPrint={"block"} display={"none"}>
                {currentSheet && (
                    <>
                        <SheetDisplay
                            sheet={currentSheet}
                            title={editedTitle as string}
                            variant={"default"}
                        />
                    </>
                )}
            </Box>
        </>
    );
}

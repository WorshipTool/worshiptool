import { LoadingButton, Masonry } from "@mui/lab";
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    LinearProgress,
    Typography,
    useTheme
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import usePagination from "../../../hooks/usePagination";
import { useIsInViewport } from "../../../hooks/useIsInViewport";
import Gap from "../../../components/Gap";
import useSongSearch from "../../../hooks/song/useSongSearch";
import {
    SearchSongDataDTO,
    SongSearchResultDTO
} from "../../../api/dtos/dtosSong";
import { grey } from "@mui/material/colors";
import normalizeSearchText from "../../../tech/normalizeSearchText";
import ContainerGrid from "../../../components/ContainerGrid";
import { mapApiToVariant } from "../../../api/dtos/variant/mapApiToVariant";
import { VariantDTO } from "../../../interfaces/variant/VariantDTO";
import { useNavigate } from "react-router-dom";
import OnChangeDelayer from "../../../components/ChangeDelayer";
import SongListCards from "../../../components/songLists/SongListCards/SongListCards";
import { Downloading, Sync } from "@mui/icons-material";

import { SongVariantDto } from "../../../api/dtos";
import { getVariantUrl } from "../../../routes/routes";

interface SearchedSongsListProps {
    searchString: string;
}
const controller = new AbortController();

export default function SearchedSongsList({
    searchString
}: SearchedSongsListProps) {
    const theme = useTheme();
    const loadNextLevelRef = useRef(null);
    const isInViewport = useIsInViewport(loadNextLevelRef, "100px");

    const [loading, setLoading] = useState<boolean>(false);
    const [nextLoading, setNextLoading] = useState<boolean>(false);
    const [enableLoadNext, setEnableLoadNext] = useState<boolean>(false);

    const searchSongs = useSongSearch();
    const {
        nextPage: loadNext,
        loadPage,
        data: songs,
        nextExists
    } = usePagination<SongVariantDto>((page, resolve, arr) => {
        // controller.abort();
        searchSongs({
            searchKey: searchString,
            page,
            signal: controller.signal
        }).then((data) => {
            setLoading(false);
            setNextLoading(false);
            resolve(
                data.filter((v) => {
                    return !arr.find((s) => s.guid == v.guid);
                })
            );
        });
    });

    useEffect(() => {
        setEnableLoadNext(false);
        setLoading(true);
    }, [searchString]);

    useEffect(() => {
        if (!enableLoadNext) return;
        if (!isInViewport) return;
        if (songs.length > 0 && nextExists) {
            setNextLoading(true);
            loadNext();
        }
    }, [isInViewport]);

    const navigate = useNavigate();

    return (
        <ContainerGrid direction="column">
            <OnChangeDelayer
                value={normalizeSearchText(searchString)}
                onChange={() => {
                    setLoading(true);
                    loadPage(0, true).then(() => {
                        setEnableLoadNext(true);
                    });
                }}
            />

            <>
                <Typography fontWeight={"bold"}>
                    Výsledky vyhledávání:
                </Typography>

                {!loading && songs.length > 0 && (
                    <SongListCards data={songs}></SongListCards>
                )}
            </>

            <div ref={loadNextLevelRef}></div>

            {loading && (
                <>
                    <LinearProgress
                        sx={{ color: grey[500] }}
                        color={"inherit"}
                    />
                </>
            )}

            <>
                {!loading && songs.length > 0 && nextExists && (
                    <>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                            <LoadingButton
                                loading={nextLoading}
                                loadingPosition="start"
                                onClick={() => {
                                    loadNext();
                                }}
                                startIcon={<Sync />}>
                                Načíst další
                            </LoadingButton>
                        </Box>
                    </>
                )}
            </>

            {!loading && songs.length < 1 && (
                <>
                    <Typography>Nic jsme nenašli...</Typography>
                </>
            )}

            <Gap />
        </ContainerGrid>
    );
}

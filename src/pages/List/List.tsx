import {
    Typography,
    Box,
    Grid,
    Paper,
    Container,
    CircularProgress,
    Divider,
    Pagination,
    styled
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Toolbar from "../../components/Toolbars/Toolbar";
import usePagination from "../../hooks/usePagination";
import Gap from "../../components/Gap";
import { useNavigate } from "react-router-dom";
import { ListResult, ListSongData, SongsApi } from "../../api/generated";
import useAuth from "../../hooks/auth/useAuth";
import { handleApiCall } from "../../tech/handleApiCall";
import { getVariantUrl } from "../../routes/routes";

const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.grey[100],

    padding: "0.6rem",
    "&:hover": {
        backgroundColor: theme.palette.grey[200],
        boxShadow: `0px 0px 7px ${theme.palette.grey[600]}`
    },
    cursor: "pointer"
}));

export default function List() {
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);

    const { apiConfiguration } = useAuth();
    const songsApi = new SongsApi(apiConfiguration);

    const {
        nextPage,
        loadPage,
        data: songs,
        nextExists
    } = usePagination<ListSongData>((page, resolve, arr) => {
        handleApiCall(songsApi.songsControllerGetList(page))
            .then((data) => {
                const uniq = data.songs.filter((v) => {
                    return !arr.find((s) => s.guid == v.guid);
                });
                resolve(uniq);
            })
            .catch((e) => {
                console.log(e);
            });
    });
    const navigate = useNavigate();

    const countPerPage = 30;
    useEffect(() => {
        const count = Math.floor(songs.length / countPerPage) + 1;
        setPageCount(count);
    }, [songs]);

    useEffect(() => {
        nextPage();
        console.log("loading");
    }, [songs]);

    const onPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <Box>
            <Toolbar />
            <Container
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                <Gap value={3} />
                <Box display={"flex"}>
                    <Typography variant="h4" fontWeight={"bold"}>
                        Seznam všech písní
                    </Typography>
                    {nextExists && (
                        <Box
                            flex={1}
                            display={"flex"}
                            sx={{
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                            <Gap horizontal value={2} />
                            <CircularProgress
                                color="inherit"
                                size={"2rem"}
                                thickness={4}
                            />
                        </Box>
                    )}
                </Box>
                <Grid
                    container
                    columns={3}
                    spacing={1}
                    paddingTop={5}
                    paddingBottom={2}>
                    {songs
                        .slice((page - 1) * countPerPage, page * countPerPage)
                        .map((s, index) => {
                            return (
                                <Grid item xs={3} md={1.5} lg={1}>
                                    <StyledPaper
                                        onClick={() => {
                                            console.log(s);
                                            navigate(getVariantUrl(s.alias));
                                        }}>
                                        <Box display={"flex"} gap={1}>
                                            <Typography fontWeight={"bold"}>
                                                {(page - 1) * countPerPage +
                                                    index +
                                                    1}
                                            </Typography>
                                            <Divider
                                                orientation="vertical"
                                                flexItem
                                            />
                                            <Typography fontWeight={300} noWrap>
                                                {s.title}{" "}
                                            </Typography>
                                        </Box>
                                    </StyledPaper>
                                </Grid>
                            );
                        })}
                </Grid>
                <Pagination
                    count={pageCount}
                    color="primary"
                    page={page}
                    onChange={onPageChange}
                />
                <Gap value={3} />
            </Container>
        </Box>
    );
}

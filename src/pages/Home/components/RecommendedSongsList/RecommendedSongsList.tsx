import { Box, CircularProgress, Grid, Typography, styled } from "@mui/material";
import ContainerGrid from "../../../../common/components/ContainerGrid";
import Gap from "../../../../common/ui/Gap/Gap";
import SongListCards, {
    SongListCardsProps
} from "../../../../common/components/songLists/SongListCards/SongListCards";
import useRecommendedSongs from "./hooks/useRecommendedSongs";
import { useSmartNavigate } from "../../../../routes";
import { Button } from "../../../../common/ui";

const GridContainer = styled(Grid)(({ theme }) => ({
    padding: 10,
    paddingTop: 5
}));

type RecommendedSongsListProps = {
    listType?: SongListCardsProps["variant"];
};

export default function RecommendedSongsList({
    listType = "row"
}: RecommendedSongsListProps) {
    const { data, isLoading, isError, isSuccess } = useRecommendedSongs();

    const navigate = useSmartNavigate();

    return (
        <ContainerGrid>
            {isSuccess && (
                <Typography fontWeight={"bold"}>Nějaký nápad:</Typography>
            )}

            {isLoading && (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        color: "black"
                    }}>
                    <Typography>Načítání nápadů...</Typography>
                    <Gap value={2} horizontal />
                    <CircularProgress size={"1.5rem"} color="inherit" />
                </Box>
            )}

            {isError && (
                <>
                    <Typography>Při načítání se vyskytla chyba...</Typography>
                </>
            )}

            <GridContainer
                container
                columns={{ xs: 1, sm: 2, md: 4 }}
                sx={{ padding: 0 }}>
                <SongListCards data={data.slice(0, 4)} variant={listType} />
            </GridContainer>

            <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                <Typography variant="subtitle2">Nebo si vyberte ze </Typography>
                <Button size="small" variant="text" to="songsList">
                    Seznamu
                </Button>
                <Typography variant="subtitle2">
                    všech písní ve zpěvníku
                </Typography>
            </Box>
        </ContainerGrid>
    );
}

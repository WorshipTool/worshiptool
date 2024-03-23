import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Typography,
    styled
} from "@mui/material";
import useRecommendedSongs from "./hooks/useRecommendedSongs";
import ContainerGrid from "../../../../components/ContainerGrid";
import { useNavigate } from "react-router-dom";
import { VariantDTO } from "../../../../interfaces/variant/VariantDTO";
import SongListCards from "../../../../components/songLists/SongListCards/SongListCards";
import Gap from "../../../../components/Gap";
import { SongVariantDto } from "../../../../api/dtos";
import { getVariantUrl } from "../../../../routes/routes";

const GridContainer = styled(Grid)(({ theme }) => ({
    padding: 10,
    paddingTop: 5
}));

export default function RecommendedSongsList() {
    const { data, isLoading, isError, isSuccess } = useRecommendedSongs();

    const navigate = useNavigate();

    const onCardClick = (variant: SongVariantDto) => {
        console.log(variant);
        navigate(getVariantUrl(variant.alias), {
            state: {
                title: variant.preferredTitle
            }
        });
    };

    const openList = () => {
        navigate("/list");
    };

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
                <SongListCards
                    variants={data.slice(0, 4)}
                    onClick={onCardClick}
                />
            </GridContainer>

            <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                <Typography variant="subtitle2">Nebo si vyberte ze </Typography>
                <Button size="small" variant="text" onClick={openList}>
                    Seznamu
                </Button>
                <Typography variant="subtitle2">
                    všech písní ve zpěvníku
                </Typography>
            </Box>
        </ContainerGrid>
    );
}

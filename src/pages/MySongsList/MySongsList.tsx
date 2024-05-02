import React from "react";
import AppLayout from "../../components/app/AppLayout/AppLayout";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import useMySongs from "./hooks/useMySongs";
import MySongItem from "./components/MySongItem";
import Gap from "../../components/Gap";
import { useWindowTitle } from "../../hooks/useWindowTitle";
import { parseVariantAlias, useSmartNavigate } from "../../routes";

export default function MySongsList() {
    const { variants, loaded } = useMySongs();
    const navigate = useSmartNavigate();
    useWindowTitle("Moje písně");
    return (
        <AppLayout>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>
                <Box
                    sx={{
                        width: 500,
                        marginTop: 5,
                        marginBottom: 5
                    }}>
                    <Typography variant="h5" fontWeight={600}>
                        Moje písně:
                    </Typography>
                    <Gap value={2} />
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
                            <Typography>Načítání...</Typography>
                            <Gap value={2} horizontal />
                            <CircularProgress size={"2rem"} color="inherit" />
                        </Box>
                    ) : (
                        <>
                            {variants.map((variant, index) => {
                                return (
                                    <MySongItem
                                        variant={variant}
                                        index={index}
                                        key={`mysong${variant.guid}`}
                                        onClick={() => {
                                            if (variant)
                                                navigate("variant", {
                                                    params: parseVariantAlias(
                                                        variant.alias
                                                    ),
                                                    state: {
                                                        title: variant.preferredTitle
                                                    }
                                                });
                                        }}></MySongItem>
                                );
                            })}

                            {variants.length == 0 && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 2
                                    }}>
                                    <Typography>
                                        Nemáš žádné vytvořené písně.
                                    </Typography>
                                    <Button
                                        onClick={() => {
                                            navigate("addMenu", {});
                                        }}
                                        variant="contained">
                                        Vytvořit
                                    </Button>
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Box>
        </AppLayout>
    );
}

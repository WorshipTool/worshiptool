import React, { useEffect, useState } from "react";
import useReadme from "./hooks/useReadme";
import { Box, Grid, Paper, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import Toolbar from "../../components/Toolbars/Toolbar";
import ContainerGrid from "../../components/ContainerGrid";
import AppLayout from "../../components/app/AppLayout/AppLayout";
import { Feedback } from "@mui/icons-material";
import FeedbackPanel from "./components/FeedbackPanel";
import Gap from "../../components/Gap";
import { useWindowTitle } from "../../hooks/useWindowTitle";

export default function Documentation() {
    const { getRawData: fetchRawData } = useReadme();

    useWindowTitle("O aplikaci");

    const [raw, setRaw] = useState("");
    useEffect(() => {
        fetchRawData().then((result) => {
            setRaw(result);
        });
    }, []);

    return (
        <AppLayout>
            <Box display={"flex"} justifyContent={"center"} padding={2}>
                <ContainerGrid
                    sx={{ justifyContent: "center" }}
                    direction="row">
                    <Grid item xs={12}>
                        <FeedbackPanel />
                        <Typography variant="h6">Dokumentace</Typography>
                        <Paper
                            sx={{
                                padding: 4
                            }}>
                            <Box>
                                <ReactMarkdown children={raw} />
                            </Box>
                        </Paper>
                    </Grid>
                    <Box
                        flex={1}
                        display={"flex"}
                        justifyContent={"end"}
                        paddingTop={1}
                        sx={{ opacity: 0.3 }}>
                        <Typography variant="caption">
                            Načteno ze souboru .md
                        </Typography>
                    </Box>
                </ContainerGrid>
            </Box>
        </AppLayout>
    );
}

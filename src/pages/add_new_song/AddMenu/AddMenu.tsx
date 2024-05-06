import React from "react";
import AppLayout from "../../../common/components/app/AppLayout/AppLayout";
import AddMenuItem from "./components/AddMenuItem";
import { Box, Typography } from "@mui/material";
import { Add, Camera, Edit, UploadFile } from "@mui/icons-material";
import { useApiStateEffect } from "../../../tech/ApiState";
import { useApi } from "../../../hooks/api/useApi";
import { handleApiCall } from "../../../tech/handleApiCall";
import { useWindowTitle } from "../../../hooks/useWindowTitle";
import { useSmartNavigate } from "../../../routes";

export default function AddMenu() {
    const navigate = useSmartNavigate();

    useWindowTitle("Nová píseň");

    const { songAddingApi } = useApi();

    const [apiState] = useApiStateEffect(() => {
        return handleApiCall(
            songAddingApi.songAddingControllerIsParserAvailable()
        );
    });

    return (
        <AppLayout>
            <Box
                sx={{
                    width: "100%",
                    height: 500,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 5
                    }}>
                    <AddMenuItem
                        disabled={!apiState.data}
                        loading={apiState.loading}
                        title="Nahrát soubor"
                        subtitle="Automaticky převeďte píseň z obrázku"
                        icon={<UploadFile fontSize="inherit" />}
                        to="upload"
                    />
                    <AddMenuItem
                        title="Sepsat ručně"
                        // subtitle='Použijte editor pro psaní textu písně'
                        icon={<Edit fontSize="inherit" />}
                        iconSize={40}
                        to="writeSong"
                    />
                </Box>
            </Box>
        </AppLayout>
    );
}

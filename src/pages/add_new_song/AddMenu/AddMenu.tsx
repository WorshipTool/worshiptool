import React from "react";
import AppLayout from "../../../components/app/AppLayout/AppLayout";
import AddMenuItem from "./components/AddMenuItem";
import { Box, Typography } from "@mui/material";
import { Add, Camera, Edit, UploadFile } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useApiStateEffect } from "../../../tech/ApiState";
import { useApi } from "../../../hooks/api/useApi";
import { handleApiCall } from "../../../tech/handleApiCall";
import { UPLOAD_URL, WRITE_SONG_URL } from "../../../routes/routes";
import { useWindowTitle } from "../../../hooks/useWindowTitle";

export default function AddMenu() {
    const navigate = useNavigate();

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
                        onClick={() => {
                            navigate(UPLOAD_URL);
                        }}
                    />
                    <AddMenuItem
                        title="Sepsat ručně"
                        // subtitle='Použijte editor pro psaní textu písně'
                        icon={<Edit fontSize="inherit" />}
                        iconSize={40}
                        onClick={() => {
                            navigate(WRITE_SONG_URL);
                        }}
                    />
                </Box>
            </Box>
        </AppLayout>
    );
}

import React from "react";
import AppContainer from "../../../components/AppContainer/AppContainer";
import AddMenuItem from "./components/AddMenuItem";
import { Box, Typography } from "@mui/material";
import { Add, Camera, Edit, UploadFile } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function AddMenu() {
    const navigate = useNavigate();
    return (
        <AppContainer>
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
                        disabled
                        title="Nahrát soubor"
                        subtitle="Automaticky převeďte píseň z obrázku"
                        icon={<UploadFile fontSize="inherit" />}
                        onClick={() => {
                            navigate("/add/upload");
                        }}
                    />
                    <AddMenuItem
                        title="Sepsat ručně"
                        // subtitle='Použijte editor pro psaní textu písně'
                        icon={<Edit fontSize="inherit" />}
                        iconSize={40}
                        onClick={() => {
                            navigate("/add/write");
                        }}
                    />
                </Box>
            </Box>
        </AppContainer>
    );
}

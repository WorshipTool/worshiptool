import React, { useState } from "react";
import AppLayout from "../../../../components/app/AppLayout/AppLayout";
import UploadPanel from "./components/UploadPanel/UploadPanel";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UPLOAD_PARSE_URL } from "../../../../routes/routes";
import { useWindowTitle } from "../../../../hooks/useWindowTitle";

export interface EasySheet {
    title: string;
    data: string;
    randomHash: string;
    originalFile: File;
}

export default function Upload() {
    const navigate = useNavigate();

    const parseFiles = async (files: File[]) => {
        navigate(UPLOAD_PARSE_URL, { state: { files: files } });
        return;
    };

    useWindowTitle("Nahrát píseň");

    return (
        <AppLayout>
            <Box
                sx={{
                    width: "100%",
                    height: 500,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: 5
                }}>
                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <UploadPanel onUpload={parseFiles} />
                </Box>
            </Box>
        </AppLayout>
    );
}

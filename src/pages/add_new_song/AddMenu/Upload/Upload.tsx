import React, { useState } from "react";
import AppLayout from "../../../../common/components/app/AppLayout/AppLayout";
import UploadPanel from "./components/UploadPanel/UploadPanel";
import { Box } from "@mui/material";
import { useWindowTitle } from "../../../../hooks/useWindowTitle";
import { useSmartNavigate } from "../../../../routes";

export interface EasySheet {
    title: string;
    data: string;
    randomHash: string;
    originalFile: File;
}

export default function Upload() {
    const navigate = useSmartNavigate();

    const parseFiles = async (files: File[]) => {
        navigate("uploadParse", { state: { files: files } });
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

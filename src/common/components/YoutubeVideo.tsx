import React, { useEffect, useState } from "react";
import useYoutube from "../../hooks/useYoutube";
import { Box, useTheme } from "@mui/material";

export default function YoutubeVideo({ src }: { src: string }) {
    const [url, setUrl] = useState("");
    const { getEmbedUrl, getId } = useYoutube();
    useEffect(() => {
        const id = getId(src);
        if (id === null) {
            console.log("Invalid youtube url.");
            return;
        }
        const emurl = getEmbedUrl(id);
        setUrl(emurl);
    }, [src]);

    // Create a 16:9 ratio container
    // maximum width: 560px

    const theme = useTheme();
    return (
        <div style={{}}>
            <Box
                sx={{
                    [theme.breakpoints.down("sm")]: {
                        display: "none"
                    }
                }}>
                <iframe
                    style={{
                        width: "560px",
                        aspectRatio: 16 / 9
                    }}
                    src={url}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen></iframe>
            </Box>

            <Box
                sx={{
                    [theme.breakpoints.up("sm")]: {
                        display: "none"
                    }
                }}>
                <iframe
                    style={{
                        aspectRatio: 16 / 9
                    }}
                    src={url}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen></iframe>
            </Box>
        </div>
    );
}

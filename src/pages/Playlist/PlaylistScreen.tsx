import React from "react";
import { useParams } from "react-router-dom";
import { InnerPlaylistProvider } from "./hooks/useInnerPlaylist";
import PlaylistPreview from "./PlaylistPreview";

export default function PlaylistScreen() {
    const { guid } = useParams();

    return !guid ? null : (
        <InnerPlaylistProvider guid={guid}>
            <PlaylistPreview />
        </InnerPlaylistProvider>
    );
}

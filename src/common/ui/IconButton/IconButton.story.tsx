import React from "react";
import { createStory } from "../../../pages/TestComponents/createStory";
import { IconButton } from "@ui/IconButton";
import { TextSnippet } from "@mui/icons-material";
import { Clickable } from "../Clickable";

const IconButtonStory = () => {
    return (
        <>
            <IconButton>
                <TextSnippet />
            </IconButton>

            <IconButton
                color="inherit"
                tooltip="Yes, document!"
                tooltipPlacement="right">
                <TextSnippet />
            </IconButton>
        </>
    );
};

createStory(IconButton, IconButtonStory);

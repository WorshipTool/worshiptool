import { Box, Button, Divider, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { storyBookComponents } from "./createStory";
import Gap from "../../common/ui/Gap/Gap";
import StoryItem from "./StoryItem";
import { Masonry } from "@mui/lab";

import {} from "@ui/index.story";

export default function TestComponents() {
    const arr = useMemo(() => {
        return storyBookComponents.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
    }, []);

    return (
        <Box padding={3}>
            <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                gap={1}>
                <Typography fontWeight={900}>Components: @ui/*</Typography>
                <Button
                    onClick={() => window.location.reload()}
                    size="small"
                    variant="contained">
                    Znovu načíst
                </Button>
            </Box>
            <Gap />

            <Divider />
            <Gap />

            <Masonry>
                {arr.map((v) => {
                    return <StoryItem item={v} key={v.name} />;
                })}
            </Masonry>
        </Box>
    );
}

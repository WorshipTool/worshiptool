import { Box, Button } from "@mui/material";
import Tooltip from "./Tooltip";
import { createStory } from "../../../pages/TestComponents/createStory";

const CustomToolkipStory = () => (
    <Tooltip title="This is a custom tooltip" placement="top-start">
        <Button>Hover me</Button>
    </Tooltip>
);

createStory(Tooltip, CustomToolkipStory);

// Create function that is default exported

import { createStory } from "../../../pages/TestComponents/createStory";
import Typography from "./Typography";

const TypographyStory = () => {
    return (
        <div>
            <Typography variant="h5">Hello World</Typography>
            <Typography variant="h6">Hello World</Typography>
            <Typography strong>Hello World</Typography>
            <Typography>Hello World</Typography>
            <Typography strong={100}>Hello World</Typography>
        </div>
    );
};

createStory(Typography, TypographyStory);

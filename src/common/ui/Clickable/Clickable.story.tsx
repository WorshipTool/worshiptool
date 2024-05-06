import { createStory } from "../../../pages/TestComponents/createStory";
import Typography from "../Typography/Typography";
import { Clickable } from "./Clickable";

const ButtonComponentStory = () => (
    <Clickable>
        <Typography>Click me</Typography>
    </Clickable>
);

createStory(Clickable, ButtonComponentStory);

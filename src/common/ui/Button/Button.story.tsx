import { createStory } from "../../../pages/TestComponents/createStory";
import Gap from "../Gap/Gap";
import { Button } from "@ui/Button";

const ButtonStory = () => {
    return (
        <div>
            <Button>Hello Button</Button>
            <Gap />
            <Button size="small" color="secondary" to="home">
                Button with link
            </Button>
            <Gap />
            <Button
                size="small"
                tooltip="Helloo"
                to="home"
                variant="outlined"
                tooltipPlacement="right">
                Button with tooltip
            </Button>
        </div>
    );
};

createStory(Button, ButtonStory);

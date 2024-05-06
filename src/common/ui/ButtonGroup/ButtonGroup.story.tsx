import { createStory } from "../../../pages/TestComponents/createStory";
import { ButtonGroup } from "@ui/ButtonGroup";
import { Button } from "@ui/Button";

const ButtonGroupStory = () => {
    return (
        <ButtonGroup>
            <Button>Button 1</Button>
            <Button color="secondary">Button 2</Button>
            <Button variant="outlined">Button 3</Button>
        </ButtonGroup>
    );
};

createStory(ButtonGroup, ButtonGroupStory);

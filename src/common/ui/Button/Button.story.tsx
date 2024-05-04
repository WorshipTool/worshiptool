import { createStory } from "../../../pages/TestComponents/createStory";
import Gap from "../Gap/Gap";
import { Button } from "@ui/Button";

const ButtonStory = () => {
    return (
        <div>
            <Button>Hello Button</Button>
            <Gap />
            <Button size="small" color="secondary">
                Hello Button
            </Button>
        </div>
    );
};

createStory(Button, ButtonStory);

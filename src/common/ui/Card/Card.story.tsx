import { Icon } from "@mui/material";
import { createStory } from "../../../pages/TestComponents/createStory";
import Typography from "../Typography/Typography";
import Card from "./Card";
import { Info } from "@mui/icons-material";

const CardStory = () => {
    return (
        <Card title="Ukazka" icon={<Info />}>
            <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                nec
            </Typography>
        </Card>
    );
};

createStory(Card, CardStory);

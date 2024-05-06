import { createStory } from "../../../pages/TestComponents/createStory";
import { CustomLink } from "./CustomLink";

const CustomLinkStory = () => (
    <CustomLink to="home" state={undefined} params={{}}>
        Click me
    </CustomLink>
);

createStory(CustomLink, CustomLinkStory);

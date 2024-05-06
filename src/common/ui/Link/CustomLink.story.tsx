import { createStory } from "../../../pages/TestComponents/createStory";
import { Link } from "./CustomLink";

const CustomLinkStory = () => (
    <Link to="home" state={undefined} params={{}}>
        Click me
    </Link>
);

createStory(Link, CustomLinkStory);

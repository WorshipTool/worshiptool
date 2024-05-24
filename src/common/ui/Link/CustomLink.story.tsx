import { createStory } from '../../../app/storybook/createStory'
import { Link } from './CustomLink'

const CustomLinkStory = () => (
	<Link to="home" params={{}}>
		Click me
	</Link>
)

createStory(Link, CustomLinkStory)

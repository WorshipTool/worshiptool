import { createStory } from '../../../app/(layout)/storybook/createStory'
import { Link } from './Link'

const LinkStory = () => (
	<Link to="home" params={{}}>
		Click me
	</Link>
)

createStory(Link, LinkStory)

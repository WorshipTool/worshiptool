import { createStory } from '../../../app/storybook/createStory'
import SearchBar from './SearchBar'

const SearchBarStory = () => {
	return <SearchBar />
}

createStory(SearchBar, SearchBarStory)

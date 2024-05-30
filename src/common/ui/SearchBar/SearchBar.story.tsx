import { createStory } from '../../../app/(layout)/storybook/createStory'
import SearchBar from './SearchBar'

const SearchBarStory = () => {
	return <SearchBar />
}

createStory(SearchBar, SearchBarStory)

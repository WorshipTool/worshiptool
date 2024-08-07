import { createStory } from '@/app/(layout)/storybook/createStory'
import { TextInput } from '@/common/ui/TextInput/TextInput'

export default function TextInputStory() {
	return <TextInput placeholder="Test input " title="Heslo" />
}

createStory(TextInput, TextInputStory)

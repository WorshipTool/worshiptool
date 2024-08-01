import { createStory } from '@/app/(layout)/storybook/createStory'
import TextField from '@/common/ui/TextField/TextField'

const TextFieldStory = () => {
	return <TextField placeholder="Sem zadejte text" />
}

createStory(TextField, TextFieldStory)

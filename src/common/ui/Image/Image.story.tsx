import { createStory } from '../../../app/(layout)/storybook/createStory'
import { Image } from './Image'

export function ImageStory() {
	return <Image src="/assets/icon.svg" alt="adf" width={'100%'} />
}

createStory(Image, ImageStory)

import { createStory } from '@/app/(layout)/storybook/createStory'
import { StandaloneCard } from '@/common/ui/StandaloneCard/StandaloneCard'

export default function StandaloneCardStory() {
	return (
		<StandaloneCard
			title="StandCard"
			subtitle="Very long description, very very long"
		>
			<div>Children</div>
		</StandaloneCard>
	)
}

createStory(StandaloneCard, StandaloneCardStory)

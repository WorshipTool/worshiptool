import { GoogleAnalytics as Ga } from '@next/third-parties/google'

export const GoogleAnalytics = () => {
	const MEASUREMENT_ID = 'G-1BHSYS3YY2'
	return (
		<>
			<Ga gaId={MEASUREMENT_ID} />
		</>
	)
}

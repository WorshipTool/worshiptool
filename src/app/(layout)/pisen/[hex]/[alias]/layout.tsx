import { Box } from '@mui/material'
import ContainerGrid from '../../../../../common/components/ContainerGrid'
import { LayoutProps, MetadataProps } from '../../../../../common/types'
import { generateMetadataTitle } from '../../../../../hooks/window-title/tech'
import { getVariantAliasFromParams, getVariantByAlias } from './tech'

export const generateMetadata = async ({
	params,
}: MetadataProps<'variant'>) => {
	const alias = getVariantAliasFromParams(params.hex, params.alias)
	try {
		const variant = await getVariantByAlias(alias)
		const songTitle = variant.variants[0].prefferedTitle
		const title = songTitle + ' (Píseň s akordy)'
		return {
			title: await generateMetadataTitle(title, 'variant', params),
		}
	} catch (e) {
		return {
			title: await generateMetadataTitle('Píseň s akordy', 'variant', params),
		}
	}
}

export default function layout(props: LayoutProps) {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				position: 'relative',
			}}
		>
			<ContainerGrid
				sx={{
					marginTop: 2,
					marginBottom: 2,
					padding: 3,
					backgroundColor: 'grey.200',
					borderStyle: 'solid',
					borderWidth: 1,
					borderColor: 'grey.400',
					borderRadius: 1,
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					displayPrint: 'none',
				}}
			>
				{props.children}
			</ContainerGrid>
			<Box
				sx={{
					display: 'none',
					displayPrint: 'block',
					flexDirection: 'column',
					alignItems: 'start',
					width: '100%',
				}}
			>
				<Box>{props.children}</Box>
			</Box>
		</Box>
	)
}

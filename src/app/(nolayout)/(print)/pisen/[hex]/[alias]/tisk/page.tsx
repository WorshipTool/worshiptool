import { Box } from '@mui/material'
import { Metadata } from 'next'
import {
	getVariantAliasFromParams,
	getVariantByAlias,
} from '../../../../../../(layout)/pisen/[hex]/[alias]/tech'
import { mapSongDataVariantApiToSongVariantDto } from '../../../../../../../api/dtos'
import SheetDisplay from '../../../../../../../common/components/SheetDisplay/SheetDisplay'
import { MetadataProps } from '../../../../../../../common/types'
import { generateMetadataTitle } from '../../../../../../../hooks/window-title/tech'
import { SmartParams } from '../../../../../../../routes'
import NotFound from '../../../../../../not-found'
import PrintOptionsPanel from '../../../../components/PrintOptionsPanel'

type PageProps = {
	params: SmartParams<'variantPrint'>
}

export const generateMetadata = async ({
	params,
}: MetadataProps<'variantPrint'>): Promise<Metadata> => {
	const title = await generateMetadataTitle('Tisk', 'variantPrint', params)

	return {
		title,
	}
}

export default async function page({ params }: PageProps) {
	try {
		const alias = getVariantAliasFromParams(params.hex, params.alias)
		const v = await getVariantByAlias(alias)
		const variant = v.variants[0]

		const variantData = mapSongDataVariantApiToSongVariantDto(variant)
		return (
			<div>
				<SheetDisplay
					title={variantData.preferredTitle}
					sheet={variantData.sheet}
					variant="modern"
				/>
				<Box
					sx={{
						position: 'fixed',
						right: 0,
						top: 0,
						displayPrint: 'none',
						padding: 1,
					}}
				>
					<PrintOptionsPanel />
				</Box>
			</div>
		)
	} catch (e) {
		return <NotFound />
	}
}

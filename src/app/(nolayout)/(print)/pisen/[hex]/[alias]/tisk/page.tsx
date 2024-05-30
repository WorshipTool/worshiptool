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
import { SmartParams, SmartSearchParams } from '../../../../../../../routes'
import NotFound from '../../../../../../not-found'

type PageProps = {
	params: SmartParams<'variantPrint'>
	searchParams: SmartSearchParams<'variantPrint'>
}

export const generateMetadata = async ({
	params,
}: MetadataProps<'variantPrint'>): Promise<Metadata> => {
	const title = await generateMetadataTitle('Tisk', 'variantPrint', params)

	return {
		title,
	}
}

export default async function page({ params, searchParams }: PageProps) {
	try {
		const alias = getVariantAliasFromParams(params.hex, params.alias)
		const v = await getVariantByAlias(alias)
		const variant = v.variants[0]

		const variantData = mapSongDataVariantApiToSongVariantDto(variant)

		const sheet = variantData.sheet
		if (searchParams.key) sheet.setKey(searchParams.key)

		return (
			<Box>
				<Box
					sx={{
						position: 'fixed',
						right: 0,
						top: 50,
						displayPrint: 'none',
						padding: 1,
					}}
				>
					{/* <PrintOptionsPanel /> */}
				</Box>
				<SheetDisplay
					title={variantData.preferredTitle}
					sheet={sheet}
					variant="printCompact"
					columns={2}
				/>
			</Box>
		)
	} catch (e) {
		return <NotFound />
	}
}

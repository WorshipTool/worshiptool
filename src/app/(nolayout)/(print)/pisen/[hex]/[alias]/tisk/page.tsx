import { Box } from '@mui/material'
import { Metadata } from 'next'
import {
	getVariantAliasFromParams,
	getVariantByAlias,
} from '../../../../../../(layout)/pisen/[hex]/[alias]/tech'
import { mapSongDataVariantApiToSongVariantDto } from '../../../../../../../api/dtos'
import SheetDisplay from '../../../../../../../common/components/SheetDisplay/SheetDisplay'
import { MetadataProps } from '../../../../../../../common/types'
import { SmartParams, SmartSearchParams } from '../../../../../../../routes'
import { generateSmartMetadata } from '../../../../../../../tech/metadata/metadata'
import NotFound from '../../../../../../not-found'

type PageProps = {
	params: SmartParams<'variantPrint'>
	searchParams: SmartSearchParams<'variantPrint'>
}

export const generateMetadata = generateSmartMetadata(
	'variantPrint',
	async ({ params }: MetadataProps<'variantPrint'>): Promise<Metadata> => {
		return {
			title: 'Tisk',
		}
	}
)

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
					hideChords={searchParams.hideChords === 'true'}
				/>
			</Box>
		)
	} catch (e) {
		return <NotFound />
	}
}

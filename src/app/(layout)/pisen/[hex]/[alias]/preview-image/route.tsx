import DefaultStylePreview from '@/common/components/SheetDisplay/styles/DefaultStylePreview'
import { useServerApi } from '@/hooks/api/useServerApi'
import { PageParams } from '@/routes'
import { makeVariantAlias } from '@/tech/song/variant/variant.utils'
import { Sheet } from '@pepavlin/sheet-api'
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge' // Rychlejší vykreslení na Vercelu

export async function GET(req: NextRequest, { params }: PageParams<'variant'>) {
	const { songGettingApi } = await useServerApi()

	const alias = makeVariantAlias(params.hex, params.alias)
	const data =
		await songGettingApi.songOneGettingControllerGetVariantDataByAlias(alias)

	const sheet = new Sheet(data.main.sheetData)

	return new ImageResponse(
		(
			<div
				style={{
					display: 'flex',
					padding: 24,
				}}
			>
				<DefaultStylePreview
					sheet={sheet}
					title={data.main.title}
					hideChords={false}
					columns={1}
				/>
			</div>
		),
		{
			width: 450,
			height: 550,
		}
	)
}

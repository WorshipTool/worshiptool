'use client'

import { mapExtendedVariantPackApiToDto } from '@/api/dtos'
import { ValidationResult } from '@/api/generated'
import { useInnerVariant } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerSong'
import { getVariantAliasFromParams } from '@/app/(layout)/pisen/[hex]/[alias]/tech'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Button } from '@/common/ui'
import { Gap } from '@/common/ui/Gap'
import {
	FormControl,
	MenuItem,
	Select,
	SelectChangeEvent,
} from '@/common/ui/mui'
import { Typography } from '@/common/ui/Typography'
import { useApi } from '@/hooks/api/useApi'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useSmartParams } from '@/routes/useSmartParams'
import { SongLanguage } from '@/types/song'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { handleApiCall } from '../../../../../../tech/handleApiCall'
export default SmartPage(Page)
function Page() {
	const { hex, alias } = useSmartParams('variantPublish')
	const variant = useInnerVariant()

	const {
		songValidationApi,
		songGettingApi,
		songPublishingApi,
		songEditingApi,
	} = useApi()

	const [validation, setValidation] = useState<ValidationResult>()
	const [qualities, setQualities] = useState<any>()
	const [language, setLanguage] = useState<SongLanguage>('cs')
	const [autoFound, setAutoFound] = useState<boolean>(false)

	const [message, setMessage] = useState<string>()
	const navigate = useSmartNavigate()

	useEffect(() => {
		const doStuff = async () => {
			const aliasString = getVariantAliasFromParams(hex, alias)

			const data = await handleApiCall(
				songGettingApi.songOneGettingControllerGetVariantDataByAlias(
					aliasString
				)
			)
			const variant = mapExtendedVariantPackApiToDto(data.main)

			const validation = await handleApiCall(
				songValidationApi.songValidationControllerValidateSheetDataAndTitle({
					sheetData: variant.sheetData,
					title: variant.title,
				})
			)

			if (!validation) setQualities({})
			const q: { [key: string]: any } = validation.qualities

			Object.keys(q).forEach((element) => {
				if (!q[element]) q[element] = undefined
			})

			setQualities({ ...q })

			setValidation(validation)

			try {
				const lang: SongLanguage =
					variant.language ||
					(
						await handleApiCall(
							songEditingApi.songEditingControllerChangeLanguage({
								packGuid: variant.packGuid,
							})
						)
					).language
				setLanguage(lang)
				setAutoFound(true)
			} catch (e) {
				console.log(e)
			}
		}
		doStuff()
	}, [])

	// const checkLanguage = async () => {
	// 	var detector = new DetectLanguage('8c1fcf13ee3b650c2b2756908104f53e')
	// 	const result = await detector.detect(
	// 		'Ahoj, kamarát, ako sa máš. Zajtra je krásny deň a dnes?'
	// 	)
	// 	console.log(result)
	// }

	const handlePublish = async () => {
		try {
			if (!autoFound) {
				await handleApiCall(
					songEditingApi.songEditingControllerChangeLanguage({
						packGuid: variant.packGuid,
						languageString: language as string,
					})
				)
			}

			const result = await handleApiCall(
				songPublishingApi.songPublishingControllerPublishVariant({
					packGuid: variant.packGuid,
				})
			)

			navigate('variant', { hex, alias })
			enqueueSnackbar(`Píseň byla zveřejněna.`)
		} catch (e) {
			setMessage((e as any).response.data.message)
		}

		// checkLanguage()
	}
	const handleChange = (event: SelectChangeEvent) => {
		setLanguage(event.target.value)
		setAutoFound(false)
	}
	return (
		<div>
			{validation ? (
				<div>
					<h1>Validace</h1>
					{validation.success ? (
						<>
							<Typography>Validace proběhla úspěšně.</Typography>
							<Gap />
							<Typography>Jazyk písně:</Typography>
							{autoFound && (
								<Typography strong>{'- Zjištěno automaticky'}</Typography>
							)}
							<FormControl
								sx={{
									width: 200,
								}}
							>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={language as string}
									// label="Jazyk"
									onChange={handleChange}
									size="small"
								>
									<MenuItem value={'cs'}>Čeština</MenuItem>
									<MenuItem value={'sk'}>Slovenština</MenuItem>
									<MenuItem value={'en'}>Angličtina</MenuItem>
								</Select>
							</FormControl>

							<Gap />
							<Button onClick={handlePublish} variant="contained">
								Zveřejnit
							</Button>
						</>
					) : (
						<>
							<Typography>Píseň není ve správném formátu.</Typography>
							{/* Qualities with true only */}
							<pre>{JSON.stringify(qualities, null, 2)}</pre>
							{validation.message && (
								<Typography>{validation.message}</Typography>
							)}
						</>
					)}
					<Typography>{message}</Typography>
				</div>
			) : (
				<div>Načítání...</div>
			)}
		</div>
	)
}

import VerifyButton from '@/app/(layout)/pisen/[hex]/[alias]/components/components/VerifyButton'
import OnlyAdmin from '@/common/components/OnlyAdmin'
import { Button } from '@/common/ui/Button'
import { Gap } from '@/common/ui/Gap'
import { Typography } from '@/common/ui/Typography'
import { useApi } from '@/hooks/api/useApi'
import { CreatedType } from '@/interfaces/variant/VariantDTO'
import { Box, useTheme } from '@mui/material'
import { Sheet } from '@pepavlin/sheet-api'
import { useSnackbar } from 'notistack'
import React, { useMemo } from 'react'
import { SongDto, SongVariantDto } from '../../../../../../api/dtos'
import {
	EditVariantOutDto,
	PostEditVariantInDto,
	SongEditingApi,
} from '../../../../../../api/generated'
import useAuth from '../../../../../../hooks/auth/useAuth'
import { parseVariantAlias } from '../../../../../../routes'
import { useSmartNavigate } from '../../../../../../routes/useSmartNavigate'
import { useApiState } from '../../../../../../tech/ApiState'
import { handleApiCall } from '../../../../../../tech/handleApiCall'
import { isSheetDataValid } from '../../../../../../tech/sheet.tech'
import NotValidWarning from '../../../../vytvorit/napsat/components/NotValidWarning'
import AddToPlaylistButton from './components/AddToPlaylistButton/AddToPlaylistButton'
import CreateCopyButton from './components/CreateCopyButton'
import EditButton from './components/EditButton'
import PrintButton from './components/PrintButton'
import SongsOptionsButton from './components/SongsOptionsButton'
import VisibilityLabel from './components/VisibilityLabel'
import TransposePanel from './TransposePanel'

interface TopPanelProps {
	transpose: (i: number) => void
	variant: SongVariantDto
	reloadSong: () => void
	sheet: Sheet
	title: string
	editedTitle: string
	song: SongDto
	// variantIndex: number
	// onChangeVariant: (i:number)=>void,
	onEditClick?: (editable: boolean) => Promise<void>
	cancelEditing: () => void
	isInEditMode?: boolean
}

export default function TopPanel(props: TopPanelProps) {
	const { isAdmin, isTrustee, isLoggedIn, user, apiConfiguration } = useAuth()

	const isOwner = useMemo(() => {
		if (!user) return false
		return props.variant.createdBy === user?.guid
	}, [user, props.variant])

	const { enqueueSnackbar } = useSnackbar()
	const navigate = useSmartNavigate()

	const songsApi = new SongEditingApi(apiConfiguration)
	const { songEditingApi, songPublishingApi } = useApi()
	const { fetchApiState } = useApiState<EditVariantOutDto>()

	const [saving, setSaving] = React.useState(false)

	const anyChange = useMemo(() => {
		const t = props.variant.preferredTitle !== props.editedTitle
		const s =
			new Sheet(props.variant?.sheetData).toString() !== props.sheet?.toString()
		return t || s
	}, [props.sheet, props.editedTitle, props.variant])

	const [languageGenerating, setLanguageGenerating] = React.useState(false)
	const generateLanguage = async () => {
		setLanguageGenerating(true)
		try {
			await handleApiCall(
				songEditingApi.songEditingControllerChangeLanguage({
					variantGuid: props.variant.guid,
				})
			)
			// Reload page
			window.location.reload()
			enqueueSnackbar('Jazyk byl úspěšně dogenerován.')
		} catch (e) {
			enqueueSnackbar('Jazyk se nepodařilo dogenerovat.')
		}
		setLanguageGenerating(false)
	}
	const [keywordsGenerating, setKeywordsGenerating] = React.useState(false)
	const generateKeyword = async () => {
		setKeywordsGenerating(true)
		try {
			await handleApiCall(
				songPublishingApi.songPublishingControllerGenerateKeywords({
					variantGuid: props.variant.guid,
				})
			)
			window.location.reload()
			enqueueSnackbar('Klíčová slova byla úspěšně dogenerována.')
		} catch (e) {
			enqueueSnackbar('Klíčová slova se nepodařilo dogenerovat.')
		}
		setKeywordsGenerating(false)
	}

	const onEditClick = async (editable: boolean) => {
		if (editable) {
			if (props.variant.verified) {
				enqueueSnackbar('Nelze upravit veřejenou píseň.')
				return
			}
			await props.onEditClick?.(editable)
			return
		}

		setSaving(true)

		const body: PostEditVariantInDto = {
			variantAlias: props.variant.alias,
			sheetData: props.sheet.getOriginalSheetData(),
			title: props.title,
			createdType: CreatedType.Manual,
		}
		fetchApiState(
			async () => {
				return await handleApiCall(
					songsApi.songEditingControllerEditVariant(body)
				)
			},
			async (result) => {
				await props.onEditClick?.(editable)
				enqueueSnackbar(
					`Píseň ${(props.variant.preferredTitle && ' ') || ''}byla upravena.`
				)
				navigate('variant', {
					...parseVariantAlias(result.alias),
				})
				setSaving(false)
			}
		)
	}

	const theme = useTheme()

	const isValid = useMemo(() => {
		if (!props.sheet) return false
		const data = props.sheet?.toString()
		return isSheetDataValid(data)
	}, [props.sheet, props.sheet?.toString()])

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					gap: 1,
				}}
			>
				{props.isInEditMode ? (
					<>
						{isValid ? <Box flex={1} /> : <NotValidWarning />}

						<Button
							onClick={() => props.cancelEditing()}
							color="info"
							variant="outlined"
						>
							Zrušit
						</Button>

						<EditButton
							onClick={onEditClick}
							inEditMode={props.isInEditMode}
							loading={saving}
							sheetData={props.sheet?.getOriginalSheetData() || ''}
							title={props.editedTitle}
							anyChange={anyChange}
						/>
					</>
				) : props.variant.deleted ? (
					<></>
				) : (
					<>
						<TransposePanel
							transpose={props.transpose}
							disabled={!Boolean(props.sheet?.getKeyChord())}
						/>

						{isOwner && <VisibilityLabel public={props.variant.public} />}

						<Box flex={1} />

						{isOwner && <VisibilityLabel public={props.variant.public} right />}
						<SongsOptionsButton
							reloadSong={props.reloadSong}
							variant={props.variant}
							sheet={props.sheet}
							song={props.song}
							onEditClick={onEditClick}
							isInEditMode={props.isInEditMode}
							saving={saving}
							editedTitle={props.editedTitle}
							isOwner={isOwner}
							anyChange={anyChange}
						/>
						{isLoggedIn() && !(isOwner && !props.variant.public) && (
							<Box
								sx={{
									[theme.breakpoints.down('md')]: {
										display: 'none',
									},
								}}
							>
								<CreateCopyButton variantGuid={props.variant.guid} />
							</Box>
						)}

						{isOwner && !props.variant.public && (
							<Box
								sx={{
									[theme.breakpoints.down('md')]: {
										display: 'none',
									},
								}}
							>
								<EditButton
									onClick={onEditClick}
									inEditMode={props.isInEditMode}
									loading={saving}
									sheetData={props.sheet?.getOriginalSheetData() || ''}
									anyChange={anyChange}
									title={props.editedTitle}
								/>
							</Box>
						)}

						{isLoggedIn() && (
							<Box
								sx={{
									[theme.breakpoints.down('sm')]: {
										display: 'none',
									},
								}}
							>
								<AddToPlaylistButton variant={props.variant} />
							</Box>
						)}

						<PrintButton keyNote={props.sheet?.getKeyNote() || null} />
					</>
				)}
			</Box>
			{isAdmin() && <Gap />}
			<OnlyAdmin>
				<Box
					display={'flex'}
					flexDirection={'row'}
					gap={1}
					alignItems={'center'}
				>
					<Typography strong>
						{props.variant.inFormat ? 'Správný formát' : 'Nevalidní formát'}
					</Typography>

					{props.variant.public ? (
						<>
							<div>
								<Typography>Píseň je public</Typography>
								{props.variant.verified !== null ? (
									<>
										{props.variant.verified ? (
											<Typography>A je manualně ověřena.</Typography>
										) : (
											<Typography>A je manualně zamítnuta.</Typography>
										)}
									</>
								) : (
									<>
										<Typography>Ale není manualně ověřena</Typography>
									</>
								)}
							</div>
							<VerifyButton variant={props.variant} />
						</>
					) : (
						<Typography>Píseň NENI public</Typography>
					)}
				</Box>
			</OnlyAdmin>
			{props.variant.public && (
				<>
					{!props.variant.language && (
						<>
							<Gap />
							<Box display={'flex'}>
								<OnlyAdmin>
									<Box display={'flex'} alignItems={'center'} gap={1}>
										<Typography>
											Píseň je sice public, ale nemá nastavený jazyk.
										</Typography>
										<Button
											size="small"
											color="secondary"
											onClick={generateLanguage}
											loading={languageGenerating}
										>
											Dogenerovat
										</Button>
									</Box>
								</OnlyAdmin>
							</Box>
						</>
					)}
					{(!props.variant.tags || props.variant.tags.length === 0) && (
						<>
							<Gap />
							<Box display={'flex'}>
								<OnlyAdmin>
									<Box display={'flex'} alignItems={'center'} gap={1}>
										<Typography>
											Píseň je sice public, ale nemá žádná klíčová slova.
										</Typography>
										<Button
											size="small"
											color="secondary"
											onClick={generateKeyword}
											loading={keywordsGenerating}
										>
											Dogenerovat
										</Button>
									</Box>
								</OnlyAdmin>
							</Box>
						</>
					)}
				</>
			)}
		</>
	)
}

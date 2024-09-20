import { SongVariantDto, VariantPackAlias } from '@/api/dtos'
import { ReplaceWithCopyOutDto } from '@/api/generated'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import Popup from '@/common/components/Popup/Popup'
import { Button } from '@/common/ui/Button'
import { Typography } from '@/common/ui/Typography'
import { useApi } from '@/hooks/api/useApi'
import { parseVariantAlias } from '@/routes'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useApiState } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import { BorderColor, FileCopy } from '@mui/icons-material'
import { Box } from '@mui/material'
import { useMemo, useState } from 'react'

type EditButtonsPanelProps = {
	inEditMode: boolean
	setInEditMode: (value: boolean) => void
	variant: SongVariantDto
	onSave: () => void
	onCancel: () => void
	saving: boolean
}

export default function EditButtonsPanel({
	inEditMode,
	setInEditMode,
	variant,
	...props
}: EditButtonsPanelProps) {
	const { selection, reload, guid: teamGuid, alias: teamAlias } = useInnerTeam()

	const needToBeCopied = useMemo(() => {
		return selection.songNeedToBeCopiedToEdit(variant)
	}, [])
	const { teamEditingApi } = useApi()
	const { fetchApiState, apiState } = useApiState<ReplaceWithCopyOutDto>()

	const [copyPopupOpen, setCopyPopupOpen] = useState(false)
	const navigate = useSmartNavigate()

	const onEditButtonClick = () => {
		if (needToBeCopied) {
			setCopyPopupOpen(true)
			return
		} else {
			setInEditMode(true)
		}
	}
	const createCopy = () => {
		fetchApiState(
			async () => {
				const data = await handleApiCall(
					teamEditingApi.teamSelectionControllerReplaceWithCopy({
						teamGuid,
						packGuid: variant.packGuid,
					})
				)

				const aliasData = parseVariantAlias(data.packAlias as VariantPackAlias)
				navigate('teamSong', {
					alias: teamAlias,
					hex: aliasData.hex,
					'title-alias': aliasData.alias,
					edit: true,
				})

				return data
			},
			(data) => {
				reload()

				setCopyPopupOpen(false)
			}
		)
	}

	const onSave = () => {
		setInEditMode(false)
		props.onSave()
	}

	const onCancel = () => {
		setInEditMode(false)
		props.onCancel()
	}

	return (
		<Box>
			<Box
				display={'flex'}
				flexDirection={'row'}
				justifyContent={'end'}
				sx={
					{
						// position: 'absolute',
						// right: 4 * 8,
					}
				}
			>
				{!inEditMode ? (
					<Button
						color="secondary"
						size="small"
						// onClick={() => setInEditMode(true)}
						endIcon={needToBeCopied ? <BorderColor /> : undefined}
						onClick={onEditButtonClick}
					>
						Upravit
					</Button>
				) : (
					<Box display={'flex'} flexDirection={'row'} gap={1}>
						<Button
							color="grey.800"
							size="small"
							onClick={onCancel}
							disabled={props.saving}
						>
							Zrušit
						</Button>
						<Button
							color="secondary"
							size="small"
							onClick={onSave}
							loading={props.saving}
						>
							Uložit
						</Button>
					</Box>
				)}
			</Box>

			<Popup
				open={copyPopupOpen}
				onClose={() => setCopyPopupOpen(false)}
				onSubmit={createCopy}
				icon={<FileCopy />}
				title="Krok před úpravou"
				width={400}
				actions={
					<>
						<Button
							size="small"
							variant="text"
							color="grey.800"
							type="reset"
							disabled={apiState.loading}
						>
							Zrušit
						</Button>
						<Button size="small" type="submit" loading={apiState.loading}>
							{!apiState.loading ? 'Pokračovat' : 'Kopírování...'}
						</Button>
					</>
				}
			>
				<Typography>
					Píseň, kterou chcete upravit je přidaná z veřejného zpěvníku. Pokud
					chcete píseň upravit, vytvoříme vám kopii této písně, kterou si můžete
					upravit.
				</Typography>
			</Popup>
		</Box>
	)
}

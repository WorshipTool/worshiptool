import { SongVariantDto } from '@/api/dtos'
import { RequireItemEditOutDto } from '@/api/generated'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useInnerTeam'
import Popup from '@/common/components/Popup/Popup'
import SmartPortalMenuItem from '@/common/components/SmartPortalMenuItem/SmartPortalMenuItem'
import { useDownSize } from '@/common/hooks/useDownSize'
import { Box } from '@/common/ui'
import { Button } from '@/common/ui/Button'
import { Typography } from '@/common/ui/Typography'
import { parseVariantAlias } from '@/routes/routes.tech'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useApiState } from '@/tech/ApiState'
import { BorderColor, Edit, FileCopy } from '@mui/icons-material'
import { useMemo, useState } from 'react'
import { VariantPackAlias } from '../../../../../../../../../../../interfaces/variant/songVariant.types'

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

	const playlistItemGuid = useMemo(() => {
		return selection.items.find((i) => i.pack.packGuid === variant.packGuid)
			?.guid!
	}, [selection, variant])

	const needToBeCopied = useMemo(() => {
		return selection.songNeedToBeCopiedToEdit(variant)
	}, [])
	const { fetchApiState, apiState } = useApiState<RequireItemEditOutDto>()

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
				const result = await selection.requireItemEdit(playlistItemGuid)
				if (result.createdCopy) {
					const aliasData = parseVariantAlias(
						result.packAlias as VariantPackAlias
					)
					navigate(
						'teamSong',
						{
							alias: teamAlias,
							hex: aliasData.hex,
							'title-alias': aliasData.alias,
							edit: true,
						},
						{
							replace: true,
						}
					)
				}

				return result
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

	const isSmall = useDownSize('md')
	const icon = needToBeCopied ? <BorderColor /> : <Edit />

	return (
		<>
			{!inEditMode ? (
				!isSmall ? (
					<Button
						color="secondary"
						size="small"
						// onClick={() => setInEditMode(true)}
						startIcon={icon}
						onClick={onEditButtonClick}
						tooltip="Upravit píseň pro tento tým"
					>
						Upravit
					</Button>
				) : (
					<SmartPortalMenuItem
						title={'Upravit'}
						subtitle="Upravit píseň pro tento tým"
						onClick={onEditButtonClick}
						icon={icon}
					/>
				)
			) : (
				<Box
					display={'flex'}
					flexDirection={'row'}
					gap={1}
					justifyContent={'end'}
				>
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
		</>
	)
}

import { ChosenSong } from '@/common/components/SongSelectPopup/SongSelectPopup'
import { Box } from '@/common/ui'
import { Tooltip } from '@/common/ui/CustomTooltip/Tooltip'
import { Typography } from '@/common/ui/Typography'

type SelectedPanelProps = {
	selected: ChosenSong[]
	onDeselect: (packGuid: string) => void
	multiselect: boolean
}

export default function SelectedPanel(props: SelectedPanelProps) {
	return (
		<>
			{props.selected.length > 0 ? (
				<Box>
					<Box
						display={'flex'}
						flexDirection={'row'}
						alignItems={'end'}
						gap={0.5}
					>
						{props.multiselect ? (
							<>
								<Typography
									strong
									sx={{
										userSelect: 'none',
									}}
								>
									Vybrané písně
								</Typography>
								<Typography size={'small'}>(Zrušíte kliknutím)</Typography>
							</>
						) : (
							<>
								<Typography
									strong
									sx={{
										userSelect: 'none',
									}}
								>
									Vybraná píseň:
								</Typography>
								<Typography
									sx={{
										userSelect: 'none',
									}}
								>
									{props.selected[0].data.title}
								</Typography>
							</>
						)}
					</Box>
					{props.multiselect && (
						<Box
							display={'flex'}
							flexDirection={'row'}
							flexWrap={'wrap'}
							gap={0.5}
						>
							{props.selected.map((c, i) => {
								return (
									<Box
										key={c.guid}
										sx={{
											userSelect: 'none',
										}}
										onClick={() => {
											props.onDeselect(c.guid)
										}}
									>
										<Tooltip title="Odebrat">
											<Typography
												sx={{
													borderBottom: '1px solid',
													borderBottomColor: 'transparent',
													'&:hover': {
														borderBottomColor: 'grey.400',
													},
													transition: 'all 0.2s',
												}}
											>
												{c.data.title}
												{i !== props.selected.length - 1 && ','}
											</Typography>
										</Tooltip>
									</Box>
								)
							})}
						</Box>
					)}
					{/* <Typography>
											{chosen.map((c) => c.title).join(', ')}
										</Typography> */}
				</Box>
			) : (
				<Box>
					<Typography
						sx={{
							userSelect: 'none',
						}}
						color="grey.600"
					>
						{props.multiselect ? (
							<>Nemáte vybranou žádnou píseň. Vyberte alespoň jednu</>
						) : (
							<>Nemáte vybranou žádnou píseň. </>
						)}
					</Typography>
				</Box>
			)}
		</>
	)
}

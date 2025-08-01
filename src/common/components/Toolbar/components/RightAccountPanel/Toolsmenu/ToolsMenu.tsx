import PopupContainer from '@/common/components/Popup/PopupContainer'
import ToolsMenuItem from '@/common/components/Toolbar/components/RightAccountPanel/Toolsmenu/components/MenuItem'
import { Box } from '@/common/ui'
import { Fade } from '@/common/ui/mui'
import { styled } from '@mui/system'
import useOutsideClick from './hooks/useOutsideClick'
import useToolsMenuItems from './hooks/useToolsMenuItems'

const Container = styled(Box)(({ theme }) => ({
	position: 'absolute',
	top: 50,
	right: theme.spacing(2),
	backgroundColor: 'white',
	borderWidth: 2,
	borderColor: '#ccc',
	// borderStyle: "solid",
	borderRadius: theme.spacing(1),
	color: 'black',
	boxShadow: '0px 1px 6px 2px #00000044',
	gap: theme.spacing(0),
	padding: theme.spacing(2),
}))

interface ToolsMenuProps {
	open?: boolean
	onClose?: () => void
}

export default function ToolsMenu({ open, onClose }: ToolsMenuProps) {
	const ref = useOutsideClick(() => {
		onClose && onClose()
	})

	const { items } = useToolsMenuItems()

	const maxRowCount = 3

	return (
		<>
			<PopupContainer>
				<Fade in={open}>
					<Container
						ref={ref}
						sx={{ display: 'flex', flexDirection: 'column' }}
					>
						{Array.from({
							length: Math.ceil(items.length / maxRowCount),
						}).map((_, i) => (
							<Box display="flex" key={i}>
								{items
									.filter((a) => !a.hidden)
									.slice(i * maxRowCount, i * maxRowCount + maxRowCount)
									.map((item, j) => (
										<ToolsMenuItem
											{...item}
											key={`menuitem${item.title}`}
											action={() => {
												item.action?.()
												if (!item.disabled) onClose?.()
											}}
										/>
									))}
							</Box>
						))}
					</Container>
				</Fade>
			</PopupContainer>
		</>
	)
}

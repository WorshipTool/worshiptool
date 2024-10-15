'use client'
import Menu from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/LeftPanel/components/Menu'
import TeamPanelTitle from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/LeftPanel/components/TeamPanelTitle'
import { useTeamSideBar } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/SmartTeamPage/hooks/useTeamSideBar'
import OnlyAdmin from '@/common/components/OnlyAdmin'
import { Button } from '@/common/ui/Button'
import { IconButton } from '@/common/ui/IconButton'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { Box } from '@mui/material'
import { useMemo } from 'react'

type TeamLeftPanelProps = {}

const TRANSITION = 'all 0.2s'
export default function TeamLeftPanel(props: TeamLeftPanelProps) {
	const { collapsed, setCollapsedManually, darkMode } = useTeamSideBar()

	const WIDTH = useMemo(() => (collapsed ? 60 : 250), [collapsed])
	return (
		<>
			<Box
				sx={{
					minWidth: WIDTH,
					maxWidth: WIDTH,

					position: 'fixed',
					height: '100%',
					bgcolor: darkMode ? 'grey.900' : 'grey.100',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					transition: TRANSITION,
					boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.1)',
					zIndex: 1,
					color: darkMode ? 'grey.100' : 'grey.800',
					overflow: 'hidden',
				}}
			>
				<TeamPanelTitle collapsed={collapsed} />
				<Menu collapsed={collapsed} transition={TRANSITION} />
				<Box flex={1} />
				<Box padding={2}>
					<OnlyAdmin>
						<Button to="home" size="small" color="secondary">
							Domů
						</Button>
					</OnlyAdmin>
				</Box>
				<Box paddingBottom={2}>
					{collapsed ? (
						<IconButton
							onClick={() => setCollapsedManually(!collapsed)}
							color="inherit"
							tooltip={'Rozbalit menu'}
							tooltipPlacement="right"
						>
							{collapsed ? <ChevronRight /> : <ChevronLeft />}
						</IconButton>
					) : (
						<Button
							onClick={() => setCollapsedManually(!collapsed)}
							color="inherit"
							tooltip={'Sbalit menu'}
							tooltipPlacement="right"
							startIcon={<ChevronLeft />}
							variant="text"
							sx={{
								minWidth: 150,
							}}
						>
							Sbalit menu
						</Button>
					)}
				</Box>
			</Box>
			<Box
				sx={{
					minWidth: WIDTH,
					maxWidth: WIDTH,
					transition: TRANSITION,
				}}
			></Box>
		</>
	)
}

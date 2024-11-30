'use client'
import TeamBottomPanel from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/LeftPanel/TeamBottomPanel'
import TeamLeftPanel from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/LeftPanel/TeamLeftPanel'
import { useTeamSideBar } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/SmartTeamPage/hooks/useTeamSideBar'
import TeamTopPanel from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/TopPanel/TeamTopPanel'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useInnerTeam'
import AdminOption from '@/common/components/admin/AdminOption'
import { useDownSize } from '@/common/hooks/useDownSize'
import { Box } from '@/common/ui'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { Analytics, DarkMode, LightMode } from '@mui/icons-material'
import React from 'react'

type Props = {
	children: React.ReactNode
}

export default function TeamClientLayout(props: Props) {
	const isSmall = useDownSize('sm')

	const { darkMode, setDarkMode } = useTeamSideBar()

	const { alias } = useInnerTeam()

	const navigate = useSmartNavigate()
	return (
		<Box display={'flex'} flexDirection={isSmall ? 'column' : 'row'}>
			{!isSmall && <TeamLeftPanel />}
			<Box display={'flex'} flexDirection={'column'} flex={1} height={'100%'}>
				<TeamTopPanel />
				<Box flex={1} paddingBottom={4}>
					{props.children}
				</Box>
			</Box>
			{isSmall && <TeamBottomPanel />}

			<AdminOption
				title="Přepnout režim menu"
				subtitle={
					darkMode ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'
				}
				icon={darkMode ? <LightMode /> : <DarkMode />}
				onClick={() => setDarkMode(!darkMode)}
			/>

			<AdminOption
				label={'Statistiky'}
				subtitle="Zobrazit stránku Statistiky"
				icon={<Analytics />}
				onClick={() => {
					navigate('teamStatistics', { alias })
				}}
			/>
		</Box>
	)
}

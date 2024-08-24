'use client'
import { ArrowBack, Home, Settings } from '@mui/icons-material'
import { Box, IconButton, Tooltip, styled } from '@mui/material'
import { ReactElement } from 'react'
import { usePermission } from '../../../../hooks/auth/usePermission'
import useGroup from '../../../../hooks/group/useGroup'
import { useSmartMatch } from '../../../../routes/useSmartMatch'
import { useSmartNavigate } from '../../../../routes/useSmartNavigate'
// import { useMatch } from "react-router-dom";
// import { routesPaths, useSmartNavigate } from "../../../../routes";

const Container = styled(Box)(({ theme }) => ({
	width: 56,
	backgroundColor: '#2f2f2f',
	height: '100%',
	color: 'white',
	alignItems: 'center',
	display: 'flex',
	flexDirection: 'column',

	position: 'fixed',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	displayPrint: 'none',
}))

const IconContainer = styled(Box)(({ theme }) => ({
	width: 56,
	height: 56,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	transition: 'all 0.2s ease',
	'&:hover': {
		filter: 'drop-shadow(4px 4px 4px #00000022)',
		transform: 'scale(108%)',
	},
	'&:active': {
		transform: 'scale(98%)',
	},
	displayPrint: 'none',
}))

interface SideToolbarProps {
	component?: ReactElement
	children?: ReactElement
}

export function SideToolbar({ component, children }: SideToolbarProps) {
	const navigate = useSmartNavigate()

	const onSettings = !!useSmartMatch('groupSettings')

	const { isOn, turnOff, name, guid, code } = useGroup()
	const isOwner = usePermission('GROUP_OWNER', guid)

	const leave = () => {
		navigate('home', {
			hledat: undefined,
		})
	}

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
				}}
			>
				<Box displayPrint={'none'}>
					<Container>
						<Box
							flex={1}
							display={'flex'}
							flexDirection={'column'}
							justifyContent={'end'}
							marginBottom={2}
							displayPrint={'none'}
							color={'white'}
						>
							{component}

							{isOwner && (
								<>
									<Tooltip title={'Zpět na stránku skupiny'} placement="right">
										<IconButton
											disabled={!onSettings}
											color={'inherit'}
											onClick={() =>
												navigate('group', {
													groupCode: code,
												})
											}
										>
											<ArrowBack />
										</IconButton>
									</Tooltip>
									<Tooltip title={'Spravovat skupinu'} placement="right">
										<IconButton
											disabled={onSettings}
											color={'inherit'}
											onClick={() =>
												navigate('groupSettings', {
													groupCode: code,
												})
											}
										>
											<Settings />
										</IconButton>
									</Tooltip>
								</>
							)}

							<Tooltip title={'Opustit mód ' + name} placement="right">
								<IconButton color={'inherit'} onClick={leave}>
									<Home />
								</IconButton>
							</Tooltip>
						</Box>
					</Container>
					<Box width={56} displayPrint={'none'} />
				</Box>
				<Box flex={1} minHeight={'calc(100vh - 56px)'}>
					{children}
				</Box>
			</Box>
		</>
	)
}

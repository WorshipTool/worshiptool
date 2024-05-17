'use client'

import { AddBox, Apps, HelpOutline, Login, Search } from '@mui/icons-material'
import { Avatar, Box, SxProps, Theme, Tooltip, styled } from '@mui/material'
import { usePathname } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import UploadFileInput from '../../../../app/nahrat/components/UploadFileInput'
import useAuth from '../../../../hooks/auth/useAuth'
import useGroup from '../../../../hooks/group/useGroup'
import { useSmartMatch } from '../../../../routes/useSmartMatch'
import { useSmartNavigate } from '../../../../routes/useSmartNavigate'
import { isMobile, isTablet } from '../../../../tech/device.tech'
import { Button } from '../../../ui/Button'
import { IconButton } from '../../../ui/IconButton'
import AccountMenu from './AccountMenu'
import GroupChip from './GroupChip'
import ToolsMenu from './Toolsmenu/ToolsMenu'

const Container = styled(Box)(({ theme }) => ({
	flex: 1,
	height: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'end',
	gap: 0,
	paddingRight: theme.spacing(2),
}))

function ProfileImage({ size, sx }: { size: number; sx?: SxProps<Theme> }) {
	return (
		<Box sx={{ ...sx }}>
			<Avatar
				src="/assets/profile-image-default.png"
				alt="Profilový obrázek"
				sx={{
					width: size,
					height: size,
					borderColor: 'inherit',
					borderStyle: 'solid',
					borderWidth: 1.1,
					pointerEvents: 'none',
				}}
			/>
		</Box>
	)
}

interface RightAccountPanelProps {
	transparent?: boolean
}

export default function RightAccountPanel({
	transparent,
}: RightAccountPanelProps) {
	const { isLoggedIn, loading } = useAuth()

	const color = useMemo(() => {
		return transparent ? 'black' : 'white'
	}, [transparent])

	const shadowColor = useMemo(() => {
		return transparent ? '#ffffff44' : '#00000044'
	}, [transparent])

	const iconStyle: SxProps<Theme> = {
		filter: `drop-shadow(4px 4px 2px ${shadowColor})`,
		transition: 'all 0.1s ease',
		'&:hover': {
			// filter: "drop-shadow(0px 4px 4px #00000044)",
			filter: `drop-shadow(4px 4px 4px ${shadowColor})`,
		},
		userSelect: 'none',
	}

	const iconButtonStyle: SxProps = {
		marginLeft: -0.25,
		pointerEvents: 'auto',
	}

	const fontSize = 'medium'

	const onToolsMenuClick = () => {
		setToolsOpen((o) => !o)
	}

	const onAccountClick = (event: React.MouseEvent<HTMLElement>) => {
		setAccountMenuAnchor(event.currentTarget)
		setAccountMenuOpen(true)
	}

	const uploadInputRef = React.useRef<HTMLInputElement>(null)

	const navigate = useSmartNavigate()
	const { isOn, code } = useGroup()
	const goHomeClick = () => {
		if (isOn) navigate('group', { groupCode: code })
		else navigate('home', {})

		setTimeout(() => {
			window?.scroll({
				top: 100,
				behavior: 'auto',
			})
			window?.dispatchEvent(new Event('searchBarFocus'))
		}, 10)
	}

	const [toolsOpen, setToolsOpen] = useState(false)

	const [accountMenuAnchor, setAccountMenuAnchor] =
		useState<null | HTMLElement>(null)
	const [accountMenuOpen, setAccountMenuOpen] = useState(false)

	const isHome = useSmartMatch('home')
	const pathname = usePathname()

	return (
		<>
			<Container color={color}>
				<UploadFileInput
					onUpload={(files) => {
						navigate('uploadParse', { files: files.map((f) => f.name) })
					}}
					inputRef={uploadInputRef}
				/>

				{isHome ? (
					<>
						<IconButton
							tooltip="O aplikaci"
							color={color}
							sx={iconButtonStyle}
							to="documentation"
						>
							<HelpOutline sx={iconStyle} fontSize={fontSize} />
						</IconButton>
					</>
				) : (
					<>
						<IconButton
							tooltip="Hledat"
							color={color}
							sx={iconButtonStyle}
							onClick={goHomeClick}
						>
							<Search sx={iconStyle} fontSize={fontSize} />
						</IconButton>
					</>
				)}

				{isLoggedIn() ? (
					<>
						{isMobile && !isTablet ? (
							<IconButton
								tooltip={'Přidat novou píseň'}
								color={color}
								sx={iconButtonStyle}
								onClick={() => uploadInputRef.current?.click()}
								disabled={false}
							>
								<AddBox sx={iconStyle} fontSize={fontSize} />
							</IconButton>
						) : (
							<IconButton
								tooltip={'Přidat novou píseň'}
								color={color}
								sx={iconButtonStyle}
								to="addMenu"
								disabled={false}
							>
								<AddBox sx={iconStyle} fontSize={fontSize} />
							</IconButton>
						)}
						<IconButton
							tooltip="Nástroje"
							color={color}
							sx={iconButtonStyle}
							onClick={onToolsMenuClick}
						>
							<Apps sx={iconStyle} fontSize={fontSize} />
						</IconButton>

						{isOn ? (
							<GroupChip
								avatar={
									<IconButton
										tooltip="Účet"
										color={color}
										sx={{
											...iconButtonStyle,
											marginRight: -2,
											marginLeft: '-0.35rem',
										}}
										onClick={onAccountClick}
									>
										<ProfileImage size={26} sx={iconStyle} />
									</IconButton>
								}
							/>
						) : (
							<IconButton
								tooltip="Účet"
								color="inherit"
								sx={iconButtonStyle}
								onClick={onAccountClick}
							>
								<ProfileImage size={26} sx={iconStyle} />
							</IconButton>
						)}

						<AccountMenu
							open={accountMenuOpen}
							onClose={() => setAccountMenuOpen(false)}
							anchor={accountMenuAnchor}
						/>

						<ToolsMenu open={toolsOpen} onClose={() => setToolsOpen(false)} />
					</>
				) : (
					<>
						<Tooltip title={'Příhlásit se'}>
							<Button
								variant="text"
								color={color}
								endIcon={<Login sx={iconStyle} fontSize={fontSize} />}
								sx={{
									pointerEvents: 'auto',
								}}
								to="login"
								toParams={{
									previousPage: pathname,
									message: '',
								}}
								loading={loading}
								loadingPosition="end"
							>
								Přihlásit se
							</Button>
						</Tooltip>
					</>
				)}
			</Container>
		</>
	)
}

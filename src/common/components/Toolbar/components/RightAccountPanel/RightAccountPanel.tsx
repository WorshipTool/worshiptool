'use client'

import AccountMenu from '@/common/components/Toolbar/components/RightAccountPanel/AccountMenu'
import GroupChip from '@/common/components/Toolbar/components/RightAccountPanel/GroupChip'
import ToolsMenu from '@/common/components/Toolbar/components/RightAccountPanel/Toolsmenu/ToolsMenu'
import { useToolbar } from '@/common/components/Toolbar/hooks/useToolbar'
import { useDownSize } from '@/common/hooks/useDownSize'
import { Box, IconButton, Tooltip, useTheme } from '@/common/ui'
import { Avatar } from '@/common/ui/mui'
import { useUserProfileImage } from '@/hooks/useUserProfileImage'
import { AddBox, Apps, Login } from '@mui/icons-material'
import { SxProps, Theme, styled } from '@mui/system'
import React, { useEffect, useMemo, useState } from 'react'
import { isMobile, isTablet } from 'react-device-detect'
import UploadFileInput from '../../../../../app/(layout)/nahrat/components/UploadFileInput'
import useAuth from '../../../../../hooks/auth/useAuth'
import useGroup from '../../../../../hooks/group/useGroup'
import { useSmartNavigate } from '../../../../../routes/useSmartNavigate'
import { Button } from '../../../../ui/Button'

const Container = styled(Box)(({ theme }) => ({
	// flex: 1,
	height: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'end',
	gap: 0,
}))

function ProfileImage({ size, sx }: { size: number; sx?: SxProps }) {
	const pictureUrl = useUserProfileImage()
	return (
		<Box sx={{ ...sx }}>
			<Avatar
				src={pictureUrl}
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

interface RightAccountPanelProps {}

export default function RightAccountPanel({}: RightAccountPanelProps) {
	const { isLoggedIn, loading } = useAuth()

	const { transparent, whiteVersion } = useToolbar()

	const shadowColor = useMemo(() => {
		return transparent && !whiteVersion ? '#ffffff44' : '#00000044'
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

	const [toolsOpen, setToolsOpen] = useState(false)

	const [accountMenuAnchor, setAccountMenuAnchor] =
		useState<null | HTMLElement>(null)
	const [accountMenuOpen, setAccountMenuOpen] = useState(false)

	const theme = useTheme()

	const [loginNextUrl, setLoginNextUrl] = useState<string>('')
	useEffect(() => {
		setLoginNextUrl(window.location.href)
	}, [])

	const isSmall = useDownSize('sm')
	const hideAddSong = isSmall || (isMobile && !isTablet)

	// return <div>rightaccountpanel</div>

	return (
		<>
			<Container>
				<UploadFileInput
					onUpload={(files) => {
						navigate('uploadParse', { files: files.map((f) => f.name) })
					}}
					inputRef={uploadInputRef}
				/>

				{isLoggedIn() ? (
					<>
						{!hideAddSong &&
							(isMobile && !isTablet ? (
								<IconButton
									tooltip={'Přidat novou píseň'}
									color={'inherit'}
									sx={iconButtonStyle}
									onClick={() => uploadInputRef.current?.click()}
									disabled={false}
								>
									<AddBox sx={iconStyle} fontSize={fontSize} />
								</IconButton>
							) : (
								<IconButton
									tooltip={'Přidat novou píseň'}
									color={'inherit'}
									sx={iconButtonStyle}
									to="addMenu"
									disabled={false}
								>
									<AddBox sx={iconStyle} fontSize={fontSize} />
								</IconButton>
							))}
						<IconButton
							tooltip="Nástroje"
							color={'inherit'}
							sx={iconButtonStyle}
							onClick={onToolsMenuClick}
						>
							<Apps sx={iconStyle} fontSize={fontSize} />
						</IconButton>

						<Box
							sx={{
								display: isOn ? 'flex' : 'none',
								[theme.breakpoints.down('sm')]: {
									display: 'none',
								},
							}}
						>
							<GroupChip
								avatar={
									<IconButton
										tooltip="Účet"
										color={'inherit'}
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
						</Box>
						<Box
							sx={{
								display: !isOn ? 'flex' : 'none',
								[theme.breakpoints.down('sm')]: {
									display: 'flex',
								},
							}}
						>
							<IconButton
								tooltip="Účet"
								color="inherit"
								sx={iconButtonStyle}
								onClick={onAccountClick}
							>
								<ProfileImage size={26} sx={iconStyle} />
							</IconButton>
						</Box>

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
								color={'inherit'}
								endIcon={<Login sx={iconStyle} fontSize={fontSize} />}
								sx={{
									pointerEvents: 'auto',
								}}
								to="login"
								toParams={{
									previousPage: loginNextUrl,
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

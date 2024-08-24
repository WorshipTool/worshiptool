'use client'

import { Box, useTheme } from '@mui/material'
import React, { useMemo } from 'react'
import useGroup from '../../../../hooks/group/useGroup'
import { useSmartNavigate } from '../../../../routes/useSmartNavigate'
import GroupToolbarDesktop from './GroupToolbarDesktop'

interface GroupToolbarProps {
	expanded?: boolean
	header?: React.ReactNode
}

export default function GroupToolbar({ expanded, header }: GroupToolbarProps) {
	const theme = useTheme()
	const { name } = useGroup()

	const height = useMemo(() => {
		return expanded ? '250px' : '56px'
	}, [expanded])

	const navigate = useSmartNavigate()

	const { isOn, code } = useGroup()
	const goHome = () => {
		if (isOn) navigate('group', { groupCode: code })
		else
			navigate('home', {
				search: undefined,
			})
		window?.scroll({
			top: 0,
			behavior: 'auto',
		})
	}

	return (
		<>
			<Box
				display={{
					xs: 'none',
					sm: 'none',
					md: 'block',
				}}
			>
				<GroupToolbarDesktop expanded={expanded} />
			</Box>
		</>
	)
}

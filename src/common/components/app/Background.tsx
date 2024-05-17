'use client'
import { Box, styled } from '@mui/material'

export const Background = styled(Box)(({ theme }) => ({
	background: `linear-gradient(160deg, ${theme.palette.grey[200]}, ${theme.palette.grey[300]})`,
	position: 'fixed',
	width: '100%',
	height: '100%',
	zIndex: -100,
}))

'use client'
import { Box } from '@/common/ui'
import { styled } from '@/common/ui/mui'

export const Background = styled(Box)(({ theme }) => ({
	background: `linear-gradient(160deg, ${theme.palette.grey[200]}, ${theme.palette.grey[300]})`,
	position: 'fixed',
	width: '100%',
	top: 0,
	bottom: 0,
	zIndex: -100,
}))

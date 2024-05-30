'use client'
import { styled, SxProps } from '@mui/material'
import NextLink from 'next/link'
import React, { ComponentProps, useEffect, useMemo } from 'react'
import { getReplacedUrlWithParams, routesPaths } from '../../../routes'
import { RoutesKeys, SmartAllParams } from '../../../routes/routes.types'

export type CommonLinkProps<T extends RoutesKeys> = {
	to: T
	params: SmartAllParams<T>
}

export type LinkProps<T extends RoutesKeys> = CommonLinkProps<T> & {
	children: React.ReactNode
	onlyWithShift?: boolean
	sx?: SxProps<{}>
	newTab?: boolean
	disabled?: boolean
} & Omit<ComponentProps<typeof NextLink>, 'href'>

const StyledLink = styled(NextLink)({})

export function Link<T extends RoutesKeys>(props: LinkProps<T>) {
	const url = useMemo(() => {
		return getReplacedUrlWithParams(
			routesPaths[props.to] || '/',
			(props.params as Record<string, string>) || {}
		)
	}, [props.to, props.params])

	const [shiftOn, setShiftOn] = React.useState(false)

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				e.key === 'Control' ||
				e.key === 'Shift' ||
				e.key === 'Alt' ||
				e.key === 'Meta'
			) {
				setShiftOn(true)
			}
		}

		const handleKeyUp = (e: KeyboardEvent) => {
			if (
				e.key === 'Control' ||
				e.key === 'Shift' ||
				e.key === 'Alt' ||
				e.key === 'Meta'
			) {
				setShiftOn(false)
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		document.addEventListener('keyup', handleKeyUp)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.removeEventListener('keyup', handleKeyUp)
		}
	}, [])

	return (props.onlyWithShift && !shiftOn) || props.disabled ? (
		<>{props.children}</>
	) : (
		<StyledLink
			// @ts-ignore
			href={url}
			passHref
			style={{
				color: 'inherit',
				textDecoration: 'none',
				...props.style,
			}}
		>
			{props.children}
		</StyledLink>
	)
}

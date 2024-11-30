'use client'
import { Box } from '@/common/ui/Box'
import BlockLinkPopup from '@/common/ui/Link/BlockLinkPopup'
import {
	LinkBlockerPopupData,
	useOutsideBlockerLinkCheck,
} from '@/common/ui/Link/useOutsideBlocker'
import { getReplacedUrlWithParams } from '@/routes/routes.tech'
import useSubdomainPathnameAlias from '@/routes/subdomains/SubdomainPathnameAliasProvider'
import { styled, SxProps } from '@mui/material'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { RouteLiteral } from 'nextjs-routes'
import React, { ComponentProps, useEffect, useMemo } from 'react'
import { routesPaths } from '../../../routes'
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
	const { aliases } = useSubdomainPathnameAlias()

	const { url, relativeUrl } = useMemo(() => {
		const absoluteUrl = getReplacedUrlWithParams(
			routesPaths[props.to] || '/',
			(props.params as Record<string, string>) || {},
			{
				absolute: true,
			}
		)
		const relativeUrl = getReplacedUrlWithParams(
			routesPaths[props.to] || '/',
			(props.params as Record<string, string>) || {},
			{
				subdomains: false,
				relative: true,
			}
		)

		// Check aliases and change absoluteUrl to subdomain if needed
		// Relative url let as is
		for (const alias of aliases) {
			if (relativeUrl.startsWith(alias.pathname)) {
				const leftPart = relativeUrl.slice(alias.pathname.length)
				const subdomainUrl = getReplacedUrlWithParams(routesPaths.subdomain, {
					subdomain: alias.subdomain,
				})

				const allNewUrl = subdomainUrl.endsWith('/')
					? subdomainUrl.slice(0, -1) + leftPart
					: subdomainUrl + leftPart
				return {
					url: allNewUrl,
					relativeUrl,
				}
			}
		}

		return {
			url: absoluteUrl,
			relativeUrl,
		}
	}, [props.to, props.params, aliases])

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

	const result = useOutsideBlockerLinkCheck({
		to: props.to,
		params: props.params,
		url: relativeUrl,
	})
	const shouldBeBlocked = result !== false
	const message = result as LinkBlockerPopupData

	const [popupOpen, setPopupOpen] = React.useState(false)
	const [redirecting, setRedirecting] = React.useState(false)

	const router = useRouter()
	const goWithNavigate = () => {
		setRedirecting(true)
		router.push(url as RouteLiteral)
	}

	return (props.onlyWithShift && !shiftOn) || props.disabled ? (
		<>{props.children}</>
	) : (
		<>
			{!shouldBeBlocked ? (
				<StyledLink
					// @ts-ignore
					href={url}
					passHref
					style={{
						color: 'inherit',
						textDecoration: 'none',
						...props.style,
					}}
					target={props.newTab ? '_blank' : props.target}
					prefetch
				>
					{props.children}
				</StyledLink>
			) : (
				<Box onClick={() => setPopupOpen(true)}>{props.children}</Box>
			)}
			<BlockLinkPopup
				open={popupOpen}
				onClose={() => setPopupOpen(false)}
				data={message}
				redirecting={redirecting}
				onSubmit={goWithNavigate}
			/>
		</>
	)
}

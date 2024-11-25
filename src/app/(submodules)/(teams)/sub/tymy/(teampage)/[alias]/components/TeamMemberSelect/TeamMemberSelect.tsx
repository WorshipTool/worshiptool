import { TeamMemberDto } from '@/api/generated'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useInnerTeam'
import Menu from '@/common/components/Menu/Menu'
import { useMemo } from 'react'

type TeamMemberSelectProps = {
	open: boolean
	onClose: () => void
	anchor: HTMLElement | null

	onSelect: (member: TeamMemberDto) => void

	filterFunc?: (member: TeamMemberDto) => boolean
}

export default function TeamMemberSelect(props: TeamMemberSelectProps) {
	const { membersApiState: apiState } = useInnerTeam()

	const members = useMemo(() => {
		return (
			apiState.data?.members.filter((m) => {
				return !props.filterFunc || props.filterFunc(m)
			}) || []
		)
	}, [apiState, props.filterFunc])

	return !apiState.data ? null : (
		<Menu
			open={props.open}
			onClose={props.onClose}
			anchor={props.anchor}
			items={[
				...members
					.filter((m) => {
						return !props.filterFunc || props.filterFunc(m)
					})
					.map((member) => ({
						title: member.firstName + ' ' + member.lastName,
						onClick: () => {
							props.onSelect(member)
							props.onClose()
						},
					})),
				...(members.length === 0
					? [{ title: 'Nikdo další k vybrání', disabled: true }]
					: []),
			]}
		></Menu>
	)
}

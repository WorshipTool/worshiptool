import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import { Box, Clickable } from '@/common/ui'
import { Avatar } from '@/common/ui/mui'
import { grey } from '@/common/ui/mui/colors'
import useAuth from '@/hooks/auth/useAuth'
import { useLiveMessage } from '@/hooks/sockets/useLiveMessage'
import { UserGuid } from '@/interfaces/user'
import { useEffect, useState } from 'react'

type Person = {
	name: string
	guid: UserGuid
}

type CardChangeData = {
	userGuid: UserGuid
	index: number
}

type StartFollowData = {
	userGuid: UserGuid
	followedUserGuid: UserGuid
}

type PeoplePanelProps = {
	onCardChange: (index: number) => void
	cardIndex: number
}

export default function PeoplePanel(props: PeoplePanelProps) {
	const { guid } = useInnerPlaylist()
	const { user } = useAuth()

	const [_people, setPeople] = useState<Person[]>([])

	const [chosen, setChosen] = useState<UserGuid | null>(null)

	// unique
	const people = _people
		.filter(
			(person, index, self) =>
				self.findIndex((p) => p.guid === person.guid) === index
		)
		// you at end
		.sort((a, b) => {
			if (a.guid === user?.guid) return 1
			if (b.guid === user?.guid) return -1
			return 0
		})

	const { send } = useLiveMessage(`playlist-${guid}-people`, {
		join: (data: Person) => {
			// Have to be logged in
			if (!user) return

			// Add person to the list
			setPeople((people) => [...people, data])

			if (data.guid !== user?.guid) {
				// Send back that I'm here
				send('imhere', {
					name: user.firstName + ' ' + user.lastName,
					guid: user.guid,
				})
			}
		},
		imhere: (data: Person) => {
			// Add person to the list
			if (!people.find((p) => p.guid === data.guid)) {
				setPeople((people) => [...people, data])
			}
		},
		leave: (data: Person) => {
			// Remove person from the list
			setPeople((people) => people.filter((p) => p.guid !== data.guid))
			if (chosen === data.guid) {
				setChosen(null)
			}
		},
		cardChange: (data: CardChangeData) => {
			if (!user) return
			if (!chosen) return

			if (chosen === data.userGuid) {
				props.onCardChange(data.index)
			}
		},
		startFollow: (data: StartFollowData) => {
			if (!user) return
			if (data.followedUserGuid === user.guid) {
				send('cardChange', {
					userGuid: user.guid,
					index: props.cardIndex,
				})
			}
		},
	})

	useEffect(() => {
		if (!user) return

		send('cardChange', {
			userGuid: user.guid,
			index: props.cardIndex,
		})
	}, [props.cardIndex, user])

	useEffect(() => {
		if (!user) return
		send('join', {
			name: user.firstName + ' ' + user.lastName,
			guid: user.guid,
		})

		return () => {
			send('leave', {
				name: user.firstName + ' ' + user.lastName,
				guid: user.guid,
			})
		}
	}, [])

	return (
		<Box color={'white'} display={'flex'} gap={1}>
			{people.length > 1 &&
				people.map((person) => {
					const selected = chosen === person.guid
					const you = person.guid === user?.guid

					const onClick = () => {
						if (!user) return
						if (selected) {
							setChosen(null)
						} else {
							setChosen(person.guid)
							send('startFollow', {
								userGuid: user.guid,
								followedUserGuid: person.guid,
							})
						}
					}

					return (
						<Clickable
							key={person.guid}
							onClick={onClick}
							tooltip={selected ? 'Zrušit sledování osoby' : 'Sledovat osobu'}
							disabled={you}
						>
							<Avatar
								key={person.guid}
								sx={{
									bgcolor: !you ? stringToColor(person.name) : 'grey',
									width: 30,
									height: 30,
									fontSize: 16,
									border: '1px solid',
									borderColor: grey[700],
									...(selected && {
										borderColor: 'white',
									}),
								}}
							>
								{person.name.split(' ')[0][0]}
								{person.name.split(' ')[1][0]}
							</Avatar>
						</Clickable>
					)
				})}
		</Box>
	)
}

function stringToColor(string: string) {
	let hash = 0
	let i

	/* eslint-disable no-bitwise */
	for (i = 0; i < string.length; i += 1) {
		hash = string.charCodeAt(i) + ((hash << 5) - hash)
	}

	let color = '#'

	for (i = 0; i < 3; i += 1) {
		const value = (hash >> (i * 8)) & 0xff
		color += `00${value.toString(16)}`.slice(-2)
	}
	/* eslint-enable no-bitwise */

	return color
}

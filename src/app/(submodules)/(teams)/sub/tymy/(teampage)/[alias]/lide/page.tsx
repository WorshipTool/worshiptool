'use client'
import { useApi } from '@/api/tech-and-hooks/useApi'
import { SmartTeamPage } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/SmartTeamPage/SmartTeamPage'
import InvitationPanel from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/lide/components/InvitationPanel'
import PeopleList from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/lide/components/PeopleList'
import TeamPeopleAdminOption from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/lide/components/TeamPeopleAdminOption'
import { encodeTeamCode } from '@/app/(submodules)/(teams)/sub/tymy/pripojitse/[code]/tech'
import Popup from '@/common/components/Popup/Popup'
import { Box } from '@/common/ui'
import { Button } from '@/common/ui/Button'
import { Gap } from '@/common/ui/Gap'

import { getRouteUrlWithParams } from '@/routes/tech/transformer.tech'
import { useSmartParams } from '@/routes/useSmartParams'
import { useApiStateEffect } from '@/tech/ApiState'
import { Link, PersonAdd } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { useCallback, useMemo, useState } from 'react'
import { TeamPageTitle } from '../components/TopPanel/components/TeamPageTitle'

export default SmartTeamPage(TeamPeoplePage)
function TeamPeoplePage() {
	const [popupOpen, setPopupOpen] = useState(false)

	const { alias } = useSmartParams('teamPeople')
	const { teamJoiningApi } = useApi()

	const [apiState] = useApiStateEffect(async () => {
		return teamJoiningApi.getJoinCode(alias)
	}, [alias])

	const joinCode = useMemo(() => {
		return apiState.data?.joinCode
	}, [apiState])

	const { enqueueSnackbar } = useSnackbar()

	const [copied, setCopied] = useState(false)
	const onCopyJoinLinkClick = useCallback(() => {
		if (!joinCode) return
		const code = joinCode

		const coded = encodeTeamCode(code)
		const link = getRouteUrlWithParams('teamJoin', { code: coded })
		navigator.clipboard.writeText(link)
		setCopied(true)

		enqueueSnackbar('Odkaz byl zkopírován do schránky')
	}, [enqueueSnackbar, joinCode])

	const onClose = () => {
		setCopied(false)
		setPopupOpen(false)
	}

	return (
		<Box display={'flex'} flexDirection={'column'} gap={4}>
			<TeamPageTitle>
				Lidé
				<Button
					size="small"
					variant="outlined"
					endIcon={<PersonAdd />}
					onClick={() => setPopupOpen(true)}
				>
					Pozvat
				</Button>
			</TeamPageTitle>
			<TeamPeopleAdminOption />
			<PeopleList />

			<Popup
				open={popupOpen}
				onClose={onClose}
				title="Pozvat"
				subtitle="Pozvěte nové členy do týmu"
				width={400}
				actions={
					<>
						<Button
							size="small"
							variant="outlined"
							startIcon={<Link />}
							onClick={onCopyJoinLinkClick}
						>
							{!copied ? 'Zkopírovat odkaz' : 'Odkaz zkopírován'}
						</Button>
						<Button size="small" variant="contained" type="reset">
							Hotovo
						</Button>
					</>
				}
			>
				<InvitationPanel joinCode={joinCode || ''} />
				<Gap />
			</Popup>
		</Box>
	)
}

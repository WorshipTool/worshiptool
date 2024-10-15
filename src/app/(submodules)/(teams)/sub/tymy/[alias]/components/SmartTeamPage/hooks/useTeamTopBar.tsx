import { SxProps } from '@mui/material'
import { createContext, useContext, useState } from 'react'

type TopBarType = ReturnType<typeof useTeamTopBarProvide>

const topbarContext = createContext({} as TopBarType)

export const useTeamTopBar = () => {
	const c = useContext(topbarContext)
	if (!c) {
		throw new Error('useTeamTopBar must be used within TeamTopBarProvider')
	}
	return c
}

export const TeamTopBarProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const v = useTeamTopBarProvide()

	return <topbarContext.Provider value={v}>{children}</topbarContext.Provider>
}

const useTeamTopBarProvide = () => {
	const [fixed, setFixed] = useState(false)
	const [sx, setSx] = useState<SxProps>({})

	return {
		fixed,
		setFixed,
		sx,
		setSx,
	}
}

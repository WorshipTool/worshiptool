import { BasicVariantPack } from '@/api/dtos'
import { ApiState } from '@/tech/ApiState'
import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react'

type SpecifierContextType = ReturnType<typeof useProvideSongSelectSpecifier>

const specifierContext = createContext<SpecifierContextType>(
	{} as SpecifierContextType
)

export const useSongSelectSpecifier = () => {
	const context = useContext(specifierContext)
	if (!context) {
		throw new Error(
			'useSongSelectSpecifier must be used within a SongSelectSpecifierProvider'
		)
	}

	return context
}

export type CustomSourceList = {
	label: string
	getData?: (searchString: string) => Promise<BasicVariantPack[]>
	onSearch?: (searchString: string) => void
	apiState?: ApiState<BasicVariantPack[]>
	showCount?: boolean
	optionsComponent?: ReactNode
}

export const SongSelectSpecifierProvider = (props: {
	children: ReactNode
	customSourceList: CustomSourceList[]
}) => {
	const p = useProvideSongSelectSpecifier(props.customSourceList)
	return (
		<specifierContext.Provider value={p}>
			{props.children}
		</specifierContext.Provider>
	)
}

const useProvideSongSelectSpecifier = (_custom: CustomSourceList[]) => {
	const [custom, setCustom] = useState<CustomSourceList[]>(_custom || [])

	useEffect(() => {
		setCustom(_custom)
	}, [_custom])
	return {
		custom,
	}
}

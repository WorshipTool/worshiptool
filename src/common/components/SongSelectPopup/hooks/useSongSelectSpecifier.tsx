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

	useEffect(() => context.tickActive(), [])

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
	onActiveChange?: (active: boolean) => void
}) => {
	const p = useProvideSongSelectSpecifier(
		props.customSourceList,
		props.onActiveChange
	)
	return (
		<specifierContext.Provider value={p}>
			{props.children}
		</specifierContext.Provider>
	)
}

const useProvideSongSelectSpecifier = (
	_custom: CustomSourceList[],
	onActiveChange?: (active: boolean) => void
) => {
	const [custom, setCustom] = useState<CustomSourceList[]>(_custom || [])

	useEffect(() => {
		setCustom(_custom)
	}, [_custom])

	const tickActive = () => {
		onActiveChange?.(true)
	}
	return {
		custom,
		tickActive,
	}
}

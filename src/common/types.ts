import { RoutesKeys, SmartParams, SmartSearchParams } from '../routes'

export type LayoutProps<T extends RoutesKeys = RoutesKeys> = {
	children: React.ReactNode
	params: SmartParams<T>
}

export type PageProps<T extends RoutesKeys = RoutesKeys> = {
	params: SmartParams<T>
	searchParams: SmartSearchParams<T>
}

export type MetadataProps<T extends RoutesKeys> = {
	params: SmartParams<T>
}

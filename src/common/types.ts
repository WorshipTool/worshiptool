import { RoutesKeys, SmartParams } from '../routes'

export type LayoutProps = {
	children: React.ReactNode
	params: SmartParams<RoutesKeys>
}

export type MetadataProps<T extends RoutesKeys> = {
	params: SmartParams<T>
}

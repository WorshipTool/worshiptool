import { DynamicRoute, Route } from 'nextjs-routes'

import { routesPaths, routesSearchParams } from './routes'

export type RoutesKeys =
	| keyof typeof routesPaths
	| keyof typeof routesSearchParams
type Path<T extends RoutesKeys> = (typeof routesPaths)[T]
type SmartRoute<T extends RoutesKeys> = Extract<Route, { pathname: Path<T> }>

type DynamicRouteParams<T extends Route> = T extends DynamicRoute<
	any,
	infer Params
>
	? Params
	: never

export type SmartParams<T extends RoutesKeys> =
	SmartRoute<T> extends DynamicRoute<any, any>
		? DynamicRouteParams<SmartRoute<T>>
		: {}

export type SmartSearchParams<T extends RoutesKeys> =
	T extends keyof typeof routesSearchParams
		? (typeof routesSearchParams)[T]
		: {}

export type SmartAllParams<T extends RoutesKeys> = SmartParams<T> &
	SmartSearchParams<T>

export type PageParams<T extends RoutesKeys> = {
	params: SmartParams<T>
	searchParams: SmartSearchParams<T>
}

import { NavigateOptions } from "react-router-dom";
import { RouterProps, routesParams } from "./routes";

export type RoutesPropsType = Record<string, undefined | Record<string, any>>;
export type RoutesPathsType<TRouterProps extends RoutesPropsType> = Record<
    keyof TRouterProps,
    string
>;
export type RoutesParamsType<TRouterProps extends RoutesPropsType> = Record<
    keyof TRouterProps,
    string[] | undefined
>;

export type SmartTo<T extends keyof RoutesPropsType> = T;
export type SmartState<T extends keyof RouterProps> = T extends string
    ? RouterProps[T]
    : undefined;

// from record, for example: group: {T: ["groupName", "groupCode"]}, I want to get {groupName: string, groupCode: string}
type PartParams<T extends keyof typeof routesParams> = (typeof routesParams)[T];

export type SmartParams<T extends keyof typeof routesParams> = Record<
    PartParams<T>[number],
    string
>;

type NavigateOptionsNoState = Omit<NavigateOptions, "state">;

// If SmartState<T> is undefined join state?, otherwise join state: SmartState<T>
export type SmartNavigateOptions<T extends keyof RouterProps> =
    NavigateOptionsNoState & SmartNavigatePartOptions<T>;
type SmartNavigatePartOptions<T extends keyof RouterProps> = RemoveUndefined<{
    state: SmartState<T>;
    params: T extends keyof typeof routesParams ? SmartParams<T> : undefined;
}>;

type RemoveUndefined<T> = {
    [K in keyof T as T[K] extends undefined ? never : K]: T[K];
};

type test = SmartNavigatePartOptions<"home">;
